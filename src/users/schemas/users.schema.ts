import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CurrencyCode } from '../enum/currency.enum';
const bcrypt = require('bcrypt');

export interface UserDocument extends Document, User {
  comparePassword(plainPassword: string): Promise<boolean>;
}

@Schema({ collection: 'users' })
export class User extends Document {
  @ApiProperty({ description: 'Логин' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'Пароль. Хранится в виде хеша' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'Код валюты',
    enum: CurrencyCode,
    default: 'RUB',
  })
  @Prop({ required: true, enum: CurrencyCode })
  currency: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export async function preSave() {
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(this.password, saltRounds);

  this.password = passwordHash;
}

export async function comparePassword(plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
}
