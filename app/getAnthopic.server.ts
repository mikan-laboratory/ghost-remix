import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';

let anthropic: Anthropic | undefined;

export const getAnthropic = (): Anthropic => {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  return anthropic;
};
