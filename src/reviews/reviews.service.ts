import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../common/data/database.service.js';
import type { Database } from '../common/data/database.model.js';
import { PlacesService } from '../places/places.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './entities/review.entity.js';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreateReviewDto): Promise<Review> {
    await this.placesService.findOne(placeId);
    const data = await this.databaseService.readDatabase();
    const review = new Review(placeId, dto);

    data.reviews.push(review);
    this.updatePlaceStatistics(placeId, data);
    await this.databaseService.writeDatabase(data);
    return review;
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    await this.placesService.findOne(placeId);
    const data = await this.databaseService.readDatabase();
    return data.reviews.filter((review) => review.placeId === placeId);
  }

  async findOne(id: string): Promise<Review> {
    const data = await this.databaseService.readDatabase();
    const review = data.reviews.find((review) => review.id === id);

    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return review;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const data = await this.databaseService.readDatabase();
    const review = data.reviews.find((review) => review.id === id);

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    Object.assign(review, dto);
    review.updatedAt = new Date().toISOString();
    this.updatePlaceStatistics(review.placeId, data);
    await this.databaseService.writeDatabase(data);
    return review;
  }

  async remove(id: string): Promise<void> {
    const data = await this.databaseService.readDatabase();
    const review = data.reviews.find((review) => review.id === id);

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    data.reviews = data.reviews.filter((review) => review.id !== id);
    this.updatePlaceStatistics(review.placeId, data);
    await this.databaseService.writeDatabase(data);
  }

  private updatePlaceStatistics(placeId: string, data: Database): void {
    const place = data.places.find((place) => place.id === placeId);
    if (!place) {
      throw new NotFoundException('Place not found.');
    }

    const reviews = data.reviews.filter((review) => review.placeId === placeId);
    place.reviewCount = reviews.length;
    place.averageRating = null;

    if (reviews.length > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      place.averageRating = Number((sum / reviews.length).toFixed(2));
    }
    place.updatedAt = new Date().toISOString();
  }
}
