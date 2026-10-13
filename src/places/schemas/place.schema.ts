import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { PlaceCategory, PlaceStatus } from '../place.enums.js';

export type PlaceDocument = HydratedDocument<Place>;

@Schema({ timestamps: true })
export class Place {
  @Prop({ type: String, default: () => randomUUID() })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: String, required: true, enum: PlaceCategory })
  category!: PlaceCategory;

  @Prop({ required: true })
  address!: string;

  @Prop({ type: [String], default: [] })
  services!: string[];

  @Prop({ type: String, enum: PlaceStatus, default: PlaceStatus.ACTIVE })
  status!: PlaceStatus;

  @Prop({ type: Number, default: null })
  averageRating!: number | null;

  @Prop({ default: 0 })
  reviewCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const PlaceSchema = 
SchemaFactory.createForClass(Place);