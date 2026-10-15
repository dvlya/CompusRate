import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../auth/dto/login.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: LoginDto) {
    return this.usersService.createUser(body.username, body.password);
  }
}