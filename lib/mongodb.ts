import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  cachedConnection = await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB || 'tlogs_admin',
  });

  return cachedConnection;
}

