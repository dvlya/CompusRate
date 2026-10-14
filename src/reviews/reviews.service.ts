import { Injectable, NotFoundException } from '@nestjs/common';
import { PlacesService } from '../places/places.service.js';
import { ReviewsRepository } from './reviews.repository.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './entities/review.entity.js';
import type { ReviewDocument } from './schemas/review.schema.js';

const err404 = '404: Review not found';

@Injectable()
export class ReviewsService {
  //remplacement de databaseService
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreateReviewDto): Promise<Review> {
    // Vérifier que le lieu existe.
    await this.placesService.findOne(placeId);

    // Enregistrer uniquement les données autorisées
    const review = await this.reviewsRepository.create({
      placeId: placeId,
      authorName: dto.authorName,
      rating: dto.rating,
      comment: dto.comment,
    });
//On recalcule la moyenne et le nombre d’avis
    await this.updatePlaceStatistics(placeId);
    return this.toResponse(review);
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    await this.placesService.findOne(placeId);

    const reviews = await this.reviewsRepository.findByPlace(placeId);

    return reviews.map(review => this.toResponse(review));
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findById(id);

    if (!review) {
      throw new NotFoundException(err404);
    }

    return this.toResponse(review);
  }
//modifie un avis existant & actualise la moyenne
  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewsRepository.findById(id);

    if (!review) {
      throw new NotFoundException(err404);
    }

    if (dto.authorName !== undefined) review.authorName = dto.authorName;
    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment;

    const updatedReview = await this.reviewsRepository.save(review);

    await this.updatePlaceStatistics(review.placeId);
    return this.toResponse(updatedReview);
  }
//supprime un avis et actualise les statistiques du lieu
  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);

    await this.reviewsRepository.deleteById(id);
    await this.updatePlaceStatistics(review.placeId);
  }

  private async updatePlaceStatistics(placeId: string): Promise<void> {
    const reviews = await this.reviewsRepository.findByPlace(placeId);

    const reviewCount = reviews.length;
    let averageRating: number | null = null;

    if (reviewCount > 0) {
      let total = 0;

      for (const review of reviews) {
        total += review.rating;
      }

      averageRating = Number((total / reviewCount).toFixed(2));
    }

    await this.placesService.updateStatistics(
      placeId,
      averageRating,
      reviewCount,
    );
  }

  private toResponse(review: ReviewDocument): Review {
    return {
      //mongodb use _id not id donc:
      id: review._id,
      placeId: review.placeId,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      //date
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}