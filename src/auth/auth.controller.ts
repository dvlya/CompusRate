import {Body,Controller, HttpCode,HttpStatus,Post,Get,Request,UseGuards,} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { Role } from '../users/role.enum.js';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Vérifie les identifiants et retourne un jeton.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    return this.authService.login(user);
  }

  // Retourne les informations du compte connecté.
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(
    @Request() req: {
      user: { userId: string; username: string; role: Role };
    },
  ) {
    return req.user;
  }
}