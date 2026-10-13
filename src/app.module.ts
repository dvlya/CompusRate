import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import databaseConfig from './config/database.config.js';

@Module({
  imports: [
    // 1. Gestion des configurations avec validation stricte
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Charge notre fichier de config
      validationSchema: Joi.object({
        // Si MONGO_URI est absent, NestJS plantera immédiatement avec un message clair
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().default(3000),
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
export class AppModule 