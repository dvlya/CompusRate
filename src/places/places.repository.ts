import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema.js';
import { Review } from '../reviews/schemas/review.schema.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { PlaceCategory } from './place.enums.js';@Injectable()
export class PlacesRepository {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel: Model<Place>,
    @InjectModel(Review.name)
  private readonly reviewModel: Model<Review>,
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
   async findAll(query: PlacesQueryDto): Promise<PlaceDocument[]> {
  // Seule la catégorie est autorisée comme filtre.
  const filter: { category?: PlaceCategory } = {};

  if (query.category !== undefined) {
    filter.category = query.category;
  }

  return this.placeModel
    .find(filter)
    .limit(query.limit)
    .skip((query.page - 1) * query.limit)
    .exec();
}
async count(query: PlacesQueryDto): Promise<number> {
  const filter: { category?: PlaceCategory } = {};

  if (query.category !== undefined) {
    filter.category = query.category;
  }

  return this.placeModel.countDocuments(filter).exec();
}
 async hasReviews(placeId: string): Promise<boolean> {
  const reviews = await this.reviewModel
    .find({ placeId: placeId })
    .exec();
    

  return reviews.length > 0;
  
}
}