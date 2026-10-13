import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema.js';

@Injectable()
export class PlacesRepository {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel: Model<Place>,
  ) {}

  async findById(id: string): Promise<PlaceDocument | null> {
    return this.placeModel.findById(id).exec();
  }

  async create(data: Partial<Place>): Promise<PlaceDocument> {
    return this.placeModel.create(data);
  }

  async save(place: PlaceDocument): Promise<PlaceDocument> {
    return place.save();
  }

  async deleteById(id: string): Promise<void> {
    await this.placeModel.findByIdAndDelete(id).exec();
  }
}