import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { PlacesRepository } from './places.repository.js';
import { Place, PlaceSchema } from './schemas/place.schema.js';
import {Review,ReviewSchema,} from '../reviews/schemas/review.schema.js';
@Module({
  imports: [
   MongooseModule.forFeature([
  { name: Place.name, schema: PlaceSchema },
  { name: Review.name, schema: ReviewSchema },
]),],
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepository],
  exports: [PlacesService],
})
export class PlacesModule {}