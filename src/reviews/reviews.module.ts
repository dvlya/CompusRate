import { PlacesModule } from '../places/places.module.js';
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { PlaceReviewsController } from './place-reviews.controller.js';

@Module({
  imports: [PlacesModule],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
