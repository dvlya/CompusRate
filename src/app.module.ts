import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import databaseConfig from './config/database.config.js';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { AuthModule } from './auth/auth.module.js';
@Module({
  imports: [
     PlacesModule,
    ReviewsModule,
    AuthModule,
    // 1. Gestion des configurations avec validation stricte
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Charge notre fichier de config
      validationSchema: Joi.object({
        // Si MONGO_URI est absent, NestJS plantera immédiatement avec un message clair
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),

    // 2. Connexion asynchrone et sécurisée à MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Récupération typée et sécurisée
        uri: configService.get<string>('database.uri'),
        // Options de production recommandées
        autoIndex: process.env.NODE_ENV !== 'production', // Désactive l'auto-indexation en prod pour les performances
      }),
    }),
  ],
})
export class AppModule {}