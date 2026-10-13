import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { PlacesRepository } from './places.repository.js';
import { Place, PlaceSchema } from './schemas/place.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
    ]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepository],
  exports: [PlacesService],
})
export class PlacesModule {}