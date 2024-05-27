/* eslint-disable no-console */
import mongoose from 'mongoose';
import { env } from '~/configs/env';

export const connectSessionMongo = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'test'
    });
    console.log('Mongo connected');
  } catch (error) {
    console.error('Mongo connection failed');
    console.error(error);
  }
};
