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
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { PaginatedPlacesDto } from './dto/paginated-places.dto.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { Place } from './entities/place.entity.js';
import { PlacesService } from './places.service.js';

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
@ApiTags('Places')
@Controller({ path: 'places', version: '1' })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campus place' })
  @ApiCreatedResponse({
    description: 'Place created.',
    type: Place,
    headers: {
      Location: {
        description: 'URI of the created place',
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
    description: 'Invalid data.',
  })
  async create(
    @Body() dto: CreatePlaceDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Place> {
    const place = await this.placesService.create(dto);
    response.location(`/api/v1/places/${place.id}`);
    return place;
  }

  @Get()
  @ApiOperation({ summary: 'List and filter campus places' })
  @ApiOkResponse({ type: PaginatedPlacesDto })
  @ApiBadRequestResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'Invalid query parameter.',
  })
  findAll(@Query() query: PlacesQueryDto): Promise<PaginatedPlacesDto> {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one campus place' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Place UUID' })
  @ApiOkResponse({ type: Place })
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
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Place> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a campus place' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Place UUID' })
  @ApiOkResponse({ type: Place })
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
    description: 'Place not found.',
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePlaceDto,
  ): Promise<Place> {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a campus place without reviews' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Place UUID' })
  @ApiNoContentResponse({ description: 'Place deleted.' })
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
  @ApiConflictResponse({
    content: {
      'application/problem+json': {
        schema: { $ref: '#/components/schemas/ProblemDetailsDto' },
      },
    },
    description: 'The place still has reviews.',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.placesService.remove(id);
  }
}
