import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { Role } from '../users/role.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Valider un utilisateur.
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user._id,
        username: user.username,
        role: user.role,
      };
    }

    throw new UnauthorizedException(
      "Nom d'utilisateur ou mot de passe invalide",
    );
  }

  // Générer un JWT.
  async login(user: { id: string; username: string; role: Role }) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}