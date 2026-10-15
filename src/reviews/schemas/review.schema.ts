import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, default: () => randomUUID() })
  _id!: string;

  @Prop({ type: String, required: true, ref: 'Place' })
  placeId!: string;
  // permission
  @Prop({ type: String, ref: 'User' })
  ownerId?: string;
  


  @Prop({ required: true })
  authorName!: string;

  @Prop({
    required: true,
    min: 1,
    max: 5,
    validate: Number.isInteger,
  })
  rating!: number;

  @Prop({ required: true })
  comment!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ReviewSchema = 
SchemaFactory.createForClass(Review);