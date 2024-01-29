//External Library Imports
import { ActionFunction, json } from '@remix-run/node';

export const action: ActionFunction = async () => {
  const cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly';

  return json(
    {
      success: true,
    },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    },
  );
};
