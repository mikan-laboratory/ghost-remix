import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  server: {
    GHOST_URL: z.string().min(1),
    GHOST_CONTENT_API_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    ENVIRONMENT: z.enum(['local', 'production']).optional(),
    LLM_URL: z.string().optional(),
    LLM_API_KEY: z.string().optional(),
  },
  client: {},
  runtimeEnv: process.env,
});
