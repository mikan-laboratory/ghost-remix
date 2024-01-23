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

    if (emailType === 'signup' && !name) {
      return json({ success: true, error: 'Name is required for signup' }, { status: 400 });
    }

    const response = await axios.post(`${env.GHOST_URL}/members/api/send-magic-link/`, {
      autoRedirect: false,
      email,
      ...(name && { name }),
      emailType,
    });

    return json({ success: response.data === 'Created.' });
  } catch (error) {
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
              <FormLabel>Name</FormLabel>
              <Input name="name" placeholder="Enter your name" />
            </FormControl>
          )}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" placeholder="Enter your email" />
          </FormControl>
          <Input type="hidden" name="emailType" value={formMode} />
          <Text>Sign {formMode === 'signin' ? 'In' : 'Up'}</Text>
          <Switch onChange={() => setFormMode(formMode === 'signin' ? 'signup' : 'signin')} />
          <Button type="submit">Submit</Button>
        </fetcher.Form>
      </Stack>
    </Box>
  );
}
