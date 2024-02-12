import { PostOrPage } from '@tryghost/content-api';

export type GetPostOutput = PostOrPage & { type: string };
