import { randomUUID } from 'node:crypto';
import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceCategory, PlaceStatus } from '../place.enums.js';

export class Place {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Cafeteria' })
  name!: string;

  @ApiProperty({
    example: 'A welcoming place to enjoy delicious meals and hang out with friends.',
  })
  description!: string;

  @ApiProperty({
    enum: PlaceCategory,
    example: PlaceCategory.CAFETERIA,
  })
  category!: PlaceCategory;

  @ApiProperty({ example: 'Main pavilion' })
  address!: string;

  @ApiProperty({
    type: [String],
    example: [
      'WIFI',
      'POWER_OUTLETS',
      'SEATING',
      'TAKEOUT',
      'MICROWAVE',
      'COFFEE',
    ],
  })
  services!: string[];

  @ApiProperty({
    enum: PlaceStatus,
    example: PlaceStatus.ACTIVE,
  })
  status!: PlaceStatus;

  @ApiProperty({ type: Number, example: 4.5, nullable: true })
  averageRating!: number | null;

  @ApiProperty({ type: 'integer', example: 2 })
  reviewCount!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  constructor(dto: CreatePlaceDto) {
    this.id = randomUUID();
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    this.address = dto.address;
    this.services = dto.services ?? [];
    this.status = dto.status ?? PlaceStatus.ACTIVE;
    this.averageRating = null;
    this.reviewCount = 0;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }
}