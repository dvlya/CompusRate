import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema.js';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,
  ) {}

  async findByPlace(placeId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ placeId: placeId }).exec();
  }

  async findById(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findById(id).exec();
  }

  async create(data: Partial<Review>): Promise<ReviewDocument> {
    return this.reviewModel.create(data);
  }

  async save(review: ReviewDocument): Promise<ReviewDocument> {
    return review.save();
  }

  async deleteById(id: string): Promise<void> {
    await this.reviewModel.findByIdAndDelete(id).exec();
  }
}