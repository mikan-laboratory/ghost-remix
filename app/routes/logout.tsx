import { ActionFunction, redirect } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly';

  return redirect('/', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
};
