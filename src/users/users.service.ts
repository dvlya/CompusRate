import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from '../password/password.service.js';
import { User, type UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly passwordService: PasswordService,
  ) {}

  // Recherche un utilisateur pour veifier ses identifiants à la connexion
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async createUser(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string }> {
    const hashedPassword =
      await this.passwordService.hashPassword(password);

    try {
      const user = await this.userModel.create({
        username,
        password: hashedPassword,
      });

      return {
        id: user._id,
        username: user.username,
      };
    } catch (error: unknown) {
      // MongoDB retourne 11000 si user pas unique
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('Username already exists.');
      }

      throw error;
    }
  }
}