import { members } from '@prisma/client';

export type BasicMember = Pick<members, 'id' | 'email' | 'name'>;
