import { Box, Button, FormControl, FormLabel, Input, Stack, Switch, Text, useUpdateEffect } from '@chakra-ui/react';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { env } from '~/env';
import { setCookie } from '~/authentication.server';

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.formData();
    const email = body.get('email');
    const name = body.get('name');
    const emailType = body.get('emailType');

    console.log('email:', email, 'name:', name, 'type:', emailType);

    if (emailType === 'signup' && !name) {
      return json({ success: true, error: 'Name is required for signup' }, { status: 400 });
    }

    console.log('URL', env.GHOST_URL);

    const response = await axios.post(`${env.GHOST_URL}/members/api/send-magic-link/`, {
      autoRedirect: false,
      email,
      ...(name && { name }),
      emailType,
    });

    console.log('created response');

    return json({ success: response.data === 'Created.' });
  } catch (error) {
    console.log(error);
    return json({ success: false, error: 'Something went wrong' }, { status: 400 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  return setCookie(request);
};

export default function MembersPage() {
  const fetcher = useFetcher<{ success: boolean; error?: string }>();
  const data = useLoaderData<{ authenticated: boolean; error?: string }>();
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signup');
  const toast = useToast();

  useEffect(() => {
    if (!data.error) return;

    toast({
      title: 'Error',
      description: data.error,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }, [data.error]);

  useUpdateEffect(() => {
    if (!fetcher.data?.success) return;

    toast({
      title: 'Email sent!',
      description: 'Check your email for the magic link.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  }, [fetcher.data]);

  useUpdateEffect(() => {
    if (!fetcher.data?.error) return;

    toast({
      title: 'Error',
      description: fetcher.data.error,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }, [fetcher.data?.error]);

  return (
    <Box px="100px" py="5%" minHeight="100vh" backgroundColor="background">
      <Stack>
        <fetcher.Form method="post">
          {formMode === 'signup' && (
            <FormControl>
              <FormLabel color="primary" fontSize="3xl">
                Name
              </FormLabel>
              <Input name="name" placeholder="Enter your name" color="text1" />
            </FormControl>
          )}
          <FormControl>
            <FormLabel color="primary" fontSize="3xl">
              Email
            </FormLabel>
            <Input name="email" placeholder="Enter your email" color="text1" />
          </FormControl>
          <Input type="hidden" name="emailType" value={formMode} />
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={5}>
            <Box>
              <Text
                color="secondary"
                onClick={() => setFormMode(formMode === 'signin' ? 'signup' : 'signin')}
                sx={{ _hover: { color: 'primary' } }}
                cursor="pointer"
              >
                {formMode === 'signin'
                  ? `Don't have an account? Sign up here!`
                  : 'Already have an account? Sign in here!'}
              </Text>
            </Box>
            <Button type="submit">Sign {formMode === 'signin' ? 'In' : 'Up'}</Button>
          </Box>
        </fetcher.Form>
      </Stack>
    </Box>
  );
}
