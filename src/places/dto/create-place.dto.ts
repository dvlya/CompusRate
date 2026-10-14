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
import { PlaceCategory, PlaceStatus } from '../place.enums.js'

export class CreatePlaceDto {
  @ApiProperty({
    example: 'Cafeteria',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  @Matches(/\S/, { message: ' name cannot be blank'  })
  name!: string;

  @ApiProperty({
    example: 'A welcoming place to enjoy delicious meals and hang out with friends.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @Length(10, 500)
  @Matches(/\S/, {
    message: ' description cannot be blank' ,
  })
  description!: string;
  
@ApiProperty({
  type: String,
  enum: PlaceCategory,
  enumName: 'PlaceCategory',
  example: PlaceCategory.CAFETERIA,
})
@IsEnum(PlaceCategory)
category!: PlaceCategory;

  @ApiProperty({
    example: 'Main Pavillon',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  @Matches(/\S/, {
    message: 'address cannot be blank',
  })
  address!: string;

  @ApiPropertyOptional({
    example: ['WIFI',
      'POWER_OUTLETS',
      'SEATING',
      'TAKEOUT',
      'MICROWAVE',
      'COFFEE',],
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
    message: 'each service cannot be blank',
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
