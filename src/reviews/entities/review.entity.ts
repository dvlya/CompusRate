import { randomUUID } from 'node:crypto';
import { CreateReviewDto } from '../dto/create-review.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  placeId!: string;

  @ApiProperty({ example: 'Dalia Laifa' })
  authorName!: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  rating!: number;

  @ApiProperty({ example: 'A calm and practical place to study.' })
  comment!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;

  constructor(placeId: string, dto: CreateReviewDto) {
    this.id = randomUUID();
    this.placeId = placeId;
    this.authorName = dto.authorName;
    this.rating = dto.rating;
    this.comment = dto.comment;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }
}
