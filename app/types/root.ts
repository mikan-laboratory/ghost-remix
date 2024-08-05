import { BasicBlogInfo } from './blog';
import { BasicMember } from './member';

export interface RootLoaderData extends BasicBlogInfo {
  member: BasicMember | null;
  cookies: string;
}
