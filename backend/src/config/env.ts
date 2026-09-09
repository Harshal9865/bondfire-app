// ==============================================================================
// ENVIRONMENT CONFIGURATION WITH ZOD SCHEMA VALIDATION
// ==============================================================================

import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/bondfire_db'),
  JWT_SECRET: z.string().min(32).default('super_secure_bondfire_jwt_secret_key_2026_at_least_32_chars_long!'),
  GOOGLE_CLIENT_ID: z.string().default('your-google-client-id.apps.googleusercontent.com'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW: z.string().default('1 minute'),
});

export const env = envSchema.parse(process.env);
