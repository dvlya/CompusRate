import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../common/data/database.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { PaginatedPlacesDto } from './dto/paginated-places.dto.js';
import { Place } from './entities/place.entity.js';

@Injectable()
export class PlacesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreatePlaceDto): Promise<Place> {
    const data = await this.databaseService.readDatabase();
    const place = new Place(dto);

    data.places.push(place);
    await this.databaseService.writeDatabase(data);
    return place;
  }

  async findAll(query: PlacesQueryDto): Promise<PaginatedPlacesDto> {
    const data = await this.databaseService.readDatabase();
    let places = data.places;

    if (query.category) {
      places = places.filter((place) => place.category === query.category);
    }

    const start = (query.page - 1) * query.limit;
    return {
      data: places.slice(start, start + query.limit),
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: places.length,
        totalPages: Math.ceil(places.length / query.limit),
      },
    };
  }

  async findOne(id: string): Promise<Place> {
    const data = await this.databaseService.readDatabase();
    const place = data.places.find((place) => place.id === id);

    if (!place) {
      throw new NotFoundException('Place not found.');
    }
    return place;
  }

  async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
    const data = await this.databaseService.readDatabase();
    const place = data.places.find((place) => place.id === id);

    if (!place) {
      throw new NotFoundException('Place not found.');
    }

    Object.assign(place, dto);
    place.updatedAt = new Date().toISOString();
    await this.databaseService.writeDatabase(data);
    return place;
  }

  async remove(id: string): Promise<void> {
    const data = await this.databaseService.readDatabase();
    const place = data.places.find((place) => place.id === id);

    if (!place) {
      throw new NotFoundException('Place not found.');
    }
    if (data.reviews.some((review) => review.placeId === id)) {
      throw new ConflictException('This place still has reviews.');
    }

    data.places = data.places.filter((place) => place.id !== id);
    await this.databaseService.writeDatabase(data);
  }
}
