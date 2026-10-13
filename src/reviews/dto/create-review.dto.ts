import { IsInt, IsString, Length, Matches, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Dalia Laifa', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  @Matches(/\S/, {
    message: 'authorName must contain non-whitespace characters',
  })
  authorName!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    example: 'A calm and practical place to study.',
    minLength: 5,
    maxLength: 1000,
  })
  @IsString()
  @Length(5, 1000)
  @Matches(/\S/, {
    message: 'comment must contain non-whitespace characters',
  })
  comment!: string;
}
