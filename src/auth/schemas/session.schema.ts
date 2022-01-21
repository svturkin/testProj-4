import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/users.schema';

export interface SessionDocument extends Document, Session {}

@Schema({ collection: 'users_sessions' })
export class Session {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  refreshTokenExpiresIn: Date;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
