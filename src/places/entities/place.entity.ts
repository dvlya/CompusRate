import { randomUUID } from 'node:crypto';
import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceCategory, PlaceStatus } from '../place.enums.js';

export class Place {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Main Library' })
  name!: string;

  @ApiProperty({ example: 'Quiet study area with Wi-Fi and outlets.' })
  description!: string;

  @ApiProperty({ enum: PlaceCategory })
  category!: PlaceCategory;

  @ApiProperty({ example: 'Building A, room A-210' })
  address!: string;

  @ApiProperty({ type: [String], example: ['WIFI', 'POWER_OUTLETS'] })
  services!: string[];

  @ApiProperty({ enum: PlaceStatus })
  status!: PlaceStatus;

  @ApiProperty({ type: Number, example: 4.5, nullable: true })
  averageRating!: number | null;

  @ApiProperty({ example: 2 })
  reviewCount!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
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
