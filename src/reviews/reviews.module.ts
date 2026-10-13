import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesModule } from '../places/places.module.js';
import { ReviewsController } from './reviews.controller.js';
import { PlaceReviewsController } from './place-reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { ReviewsRepository } from './reviews.repository.js';
import { Review, ReviewSchema } from './schemas/review.schema.js';

@Module({
  imports: [
    PlacesModule,
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}