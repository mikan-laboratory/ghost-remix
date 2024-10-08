import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  server: {
    BLOG_URL: z.string().min(1),
    GHOST_URL: z.string().min(1),
    GHOST_CONTENT_API_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    ENVIRONMENT: z.enum(['local', 'production']).optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    IMAGE_OUTPUT_DIRECTORY: z.string().min(1),
  },
  client: {},
  runtimeEnv: process.env,
});
