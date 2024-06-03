import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';

const FIVE_MINUTES = 60 * 5;

export class Token {
  _id!: mongoose.Types.ObjectId;

  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  token!: string;

  @prop({ default: Date.now, expires: FIVE_MINUTES })
  createdAt?: Date;
}

export const TokenModel = getModelForClass(Token);