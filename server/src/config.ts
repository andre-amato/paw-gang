import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const SERVER_PORT: number | string = 3001;
export const LOCAL_IP_ADDRESS = '192.168.0.73';
export const GOOGLE_MAPS_API_KEY: string = process.env.GOOGLE_MAPS_API_KEY || '';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paw-gang';
export const TEST_MONOGDB_URI =
  process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/paw-gang-test';
