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
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { ProblemDetailsDto } from '../common/dto/problem-details.dto.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { PaginatedPlacesDto } from './dto/paginated-places.dto.js';
import { Place } from './entities/place.entity.js';
import { PlacesService } from './places.service.js';

@ApiTags('Places')
@ApiInternalServerErrorResponse({
  description: 'Erreur interne.',
  type: ProblemDetailsDto,
})
@Controller({ path: 'places', version: '1' })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un lieu' })
  @ApiCreatedResponse({
    description: 'Lieu créé.',
    type: Place,
    headers: {
      Location: {
        description: 'Adresse du lieu créé.',
        schema: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou propriétés non autorisées.',
    type: ProblemDetailsDto,
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
  @ApiOperation({ summary: 'Lister et filtrer les lieux' })
  @ApiOkResponse({ type: PaginatedPlacesDto })
  @ApiBadRequestResponse({
    description: 'Filtres ou pagination invalides.',
    type: ProblemDetailsDto,
  })
  findAll(@Query() query: PlacesQueryDto): Promise<PaginatedPlacesDto> {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un lieu' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Place })
  @ApiBadRequestResponse({
    description: 'Identifiant UUID invalide.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Lieu introuvable.',
    type: ProblemDetailsDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Place> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un lieu' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Place })
  @ApiBadRequestResponse({
    description: 'Identifiant ou données invalides.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Lieu introuvable.',
    type: ProblemDetailsDto,
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePlaceDto,
  ): Promise<Place> {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un lieu sans avis' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Lieu supprimé.' })
  @ApiBadRequestResponse({
    description: 'Identifiant UUID invalide.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Lieu introuvable.',
    type: ProblemDetailsDto,
  })
  @ApiConflictResponse({
    description: 'Le lieu possède encore des avis.',
    type: ProblemDetailsDto,
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.placesService.remove(id);
  }
}