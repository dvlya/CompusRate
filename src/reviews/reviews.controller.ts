import { ProblemDetailsDto } from '../common/dto/problem-details.dto.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateReviewDto } from './dto/update-review.dto.js';
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
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get one review' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Review UUID' })
  @ApiOkResponse({ type: Review })
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
    description: 'Review not found.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a review' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Review UUID' })
  @ApiOkResponse({ type: Review })
  @ApiBadRequestResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Invalid body.',
  })
  @ApiNotFoundResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Review not found.',
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Review UUID' })
  @ApiNoContentResponse({ description: 'Review deleted.' })
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
    description: 'Review not found.',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.reviewsService.remove(id);
  }
}
