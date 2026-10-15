import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,ParseUUIDPipe,Patch,Post,Query,Res,} from '@nestjs/common';
import {ApiBadRequestResponse, ApiConflictResponse,ApiCreatedResponse,ApiInternalServerErrorResponse,ApiNoContentResponse,ApiNotFoundResponse,ApiOkResponse,ApiOperation,ApiParam,ApiTags,} from '@nestjs/swagger';
import type { Response } from 'express';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { PlacesQueryDto } from './dto/places-query.dto.js';
import { PaginatedPlacesDto } from './dto/paginated-places.dto.js';
import { Place } from './entities/place.entity.js';
import { PlacesService } from './places.service.js';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
@ApiTags('Places')
@ApiInternalServerErrorResponse({
  description: 'Internal error.',
  type: ProblemDetailsDto,
})
@Controller({ path: 'places', version: '1' })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a campus place' })
  @ApiCreatedResponse({
    description: 'Place created.',
    type: Place,
    headers: {
      Location: {
        description: 'URI of the created place.',
        schema: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or unauthorized properties.',
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
  @ApiOperation({ summary: 'List and filter campus places' })
  @ApiOkResponse({ type: PaginatedPlacesDto })
  @ApiBadRequestResponse({
    description: 'Invalid filters or pagination.',
    type: ProblemDetailsDto,
  })
  findAll(@Query() query: PlacesQueryDto): Promise<PaginatedPlacesDto> {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one campus place' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Place })
  @ApiBadRequestResponse({
    description: 'Invalid UUID.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Place not found.',
    type: ProblemDetailsDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Place> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a campus place' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Place })
  @ApiBadRequestResponse({
    description: 'Invalid identifier or data.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Place not found.',
    type: ProblemDetailsDto,
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePlaceDto,
  ): Promise<Place> {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a campus place without reviews' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Place deleted.' })
  @ApiBadRequestResponse({
    description: 'Invalid UUID.',
    type: ProblemDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'Place not found.',
    type: ProblemDetailsDto,
  })
  @ApiConflictResponse({
    description: 'The place still has reviews.',
    type: ProblemDetailsDto,
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.placesService.remove(id);
  }
}