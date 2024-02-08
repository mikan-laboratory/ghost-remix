export interface GhostSignInErrorResponse {
  errors: {
    message: string;
  }[];
}

export type GhostSignInResponse = string | GhostSignInErrorResponse;

export class GhostAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GhostAPIError';
  }
}
