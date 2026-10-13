import { ProblemDetailsDto } from '../common/dto/problem-details.dto.js';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { Review } from './entities/review.entity.js';
import { ReviewsService } from './reviews.service.js';

@ApiExtraModels(ProblemDetailsDto)
@ApiResponse({
  status: 500,
  description: 'Internal error.',
  content: {
    'application/problem+json': {
      schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
    },
  },
})
@ApiTags('Reviews')
@Controller({ path: 'places/:placeId/reviews', version: '1' })
export class PlaceReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review for a campus place' })
  @ApiParam({ name: 'placeId', format: 'uuid', description: 'Place UUID' })
  @ApiCreatedResponse({
    description: 'Review created.',
    type: Review,
    headers: {
      Location: {
        description: 'URI of the created review',
        schema: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Invalid data or UUID.',
  })
  @ApiNotFoundResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Place not found.',
  })
  async create(
    @Param('placeId', new ParseUUIDPipe({ version: '4' })) placeId: string,
    @Body() dto: CreateReviewDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Review> {
    const review = await this.reviewsService.create(placeId, dto);
    response.location(`/api/v1/reviews/${review.id}`);
    return review;
  }

  @Get()
  @ApiOperation({ summary: 'List reviews for a campus place' })
  @ApiParam({ name: 'placeId', format: 'uuid', description: 'Place UUID' })
  @ApiOkResponse({ type: Review, isArray: true })
  @ApiBadRequestResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Malformed UUID.',
  })
  @ApiNotFoundResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Place not found.',
  })
  findByPlace(
    @Param('placeId', new ParseUUIDPipe({ version: '4' })) placeId: string,
  ): Promise<Review[]> {
    return this.reviewsService.findByPlace(placeId);
  }
}
