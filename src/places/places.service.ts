import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlacesRepository } from './places.repository.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { PaginatedPlacesDto } from './dto/paginated-places.dto.js';
import { Place } from './entities/place.entity.js';
import { PlaceStatus } from './place.enums.js';
import type { PlaceDocument } from './schemas/place.schema.js';

const err404 = '404: Place not found';

@Injectable()
export class PlacesService {
  constructor(private readonly placesRepository: PlacesRepository) {}

  async create(dto: CreatePlaceDto): Promise<Place> {
    //demende a mangodb d'attendre + enregister ce que lutilisateur lui envoi
    const place = await this.placesRepository.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      address: dto.address,
      services: dto.services ?? [],
      status: dto.status ?? PlaceStatus.ACTIVE,
    });

    return this.toResponse(place);
  }

  async findAll(query: PlacesQueryDto): Promise<PaginatedPlacesDto> {
    let places = await this.placesRepository.findAll();
//filtre les categorie demendee dans le query
    if (query.category) {
      places = places.filter(
        place => place.category === query.category,
      );
    }
//pagination 
    const start = (query.page - 1) * query.limit;
    const pagePlaces = places.slice(start, start + query.limit);

    return {
      data: pagePlaces.map(place => this.toResponse(place)),
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: places.length,
        totalPages: Math.ceil(places.length / query.limit),
      },
    };
  }
// consulter un lieu par id si il ne trouve pas => message erreur(404)
  async findOne(id: string): Promise<Place> {
    const place = await this.placesRepository.findById(id);

    if (!place) {
      throw new NotFoundException(err404);
    }

    return this.toResponse(place);
  }

  async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
    const place = await this.placesRepository.findById(id);

    if (!place) {
      throw new NotFoundException(err404);
    }

    if (dto.name !== undefined) place.name = dto.name;
    if (dto.description !== undefined) place.description = dto.description;
    if (dto.category !== undefined) place.category = dto.category;
    if (dto.address !== undefined) place.address = dto.address;
    if (dto.services !== undefined) place.services = dto.services;
    if (dto.status !== undefined) place.status = dto.status;

    const updatedPlace = await this.placesRepository.save(place);

    return this.toResponse(updatedPlace);
  }


  async remove(id: string): Promise<void> {
    await this.findOne(id);
//refuse la suppression avec conflits(409) car possede avis
    if (await this.placesRepository.hasReviews(id)) {
      throw new ConflictException('This place still has reviews.');
    }
    await this.placesRepository.deleteById(id);}
    // Enregistre la moyenne et le nombre d'avis 
async updateStatistics(
  id: string,
  averageRating: number | null,
  reviewCount: number,
): Promise<void> {
  const place = await this.placesRepository.findById(id);

  if (!place) {
    throw new NotFoundException(err404);
  }

  place.averageRating = averageRating;
  place.reviewCount = reviewCount;

  await this.placesRepository.save(place);
}
  private toResponse(place: PlaceDocument): Place {
    //msngoDB utilise _id, pas id
    return {
      id: place._id,
      name: place.name,
      description: place.description,
      category: place.category,
      address: place.address,
      services: place.services,
      status: place.status,
      averageRating: place.averageRating,
      reviewCount: place.reviewCount,
      //dates
      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    };
  }
}