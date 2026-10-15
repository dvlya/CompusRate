import { randomUUID } from 'node:crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { Role } from '../role.enum.js';

export type UserDocument = HydratedDocument<User>;

// Enregistre les utilisateurs dans MongoDB avec les dates de création et de modification.
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, default: () => randomUUID() })
  _id!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  // Contient le mot de passe ## avec bcryptjs
  @Prop({ required: true })
  password!: string;

  // Un nouvel utilisateur reçoit le role USER par défaut
  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
    required: true,
  })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);