//External Library Imports
import GhostContentAPI from '@tryghost/content-api';

//Internal Module Imports
import { env } from '~/env';

export const ghostContentAPI = new GhostContentAPI({
  url: env.GHOST_URL,
  key: env.GHOST_CONTENT_API_KEY,
  version: 'v5.0',
});
