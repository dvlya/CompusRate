import {
  ArrayUnique,
  ArrayMaxSize,
  IsArray,
  IsEnum,
  ValidateIf,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceCategory, PlaceStatus } from '../place.enums.js';

export class CreatePlaceDto {
  @ApiProperty({
    example: 'Main Library',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  @Matches(/\S/, { message: 'name must contain non-whitespace characters' })
  name!: string;

  @ApiProperty({
    example: 'Quiet study area with Wi-Fi and power outlets.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @Length(10, 500)
  @Matches(/\S/, {
    message: 'description must contain non-whitespace characters',
  })
  description!: string;

  @ApiProperty({
    enum: PlaceCategory,
    example: PlaceCategory.LIBRARY,
  })
  @IsEnum(PlaceCategory)
  category!: PlaceCategory;

  @ApiProperty({
    example: 'Building A, room A-210',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  @Matches(/\S/, {
    message: 'address must contain non-whitespace characters',
  })
  address!: string;

  @ApiPropertyOptional({
    example: ['WIFI', 'POWER_OUTLETS'],
    default: [],
    type: [String],
  })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  @Matches(/\S/, {
    each: true,
    message: 'each service must contain non-whitespace characters',
  })
  services?: string[];

  @ApiPropertyOptional({
    enum: PlaceStatus,
    default: PlaceStatus.ACTIVE,
  })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}
