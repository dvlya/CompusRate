import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../entities/place.entity.js';

export class PaginationDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 0 })
  totalItems!: number;

  @ApiProperty({ example: 0 })
  totalPages!: number;
}

export class PaginatedPlacesDto {
  @ApiProperty({ type: [Place] })
  data!: Place[];

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;
}
