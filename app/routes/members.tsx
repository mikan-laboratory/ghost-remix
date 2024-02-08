//External Library Imports
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, useUpdateEffect } from '@chakra-ui/react';
import { ActionFunction, LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData, Link } from '@remix-run/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
//Internal Module Imports
import { env } from '~/env';
import { setCookie } from '~/setCookie.server';
import { GhostSignInErrorResponse, GhostSignInResponse, GhostAPIError } from './types';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Members',
    },
    {
      name: 'description',
      content: 'Sign in page for members',
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.formData();
    const email = body.get('email');
    const name = body.get('name');
    const emailType = body.get('emailType');

    if (emailType === 'signup' && !name) {
      return json({ success: true, error: 'Name is required for signup' }, { status: 400 });
    }

    const response = await axios.post<GhostSignInResponse>(
      `${env.GHOST_URL}/members/api/send-magic-link/`,
      {
        autoRedirect: false,
        email,
        ...(name && { name }),
        emailType,
      },
      {
        validateStatus: () => true,
      },
    );

    if ((response.data as GhostSignInErrorResponse).errors) {
      throw new GhostAPIError((response.data as GhostSignInErrorResponse).errors[0].message);
    }

    return json({ success: response.status === 201 });
  } catch (error) {
    console.log(error);

    return json(
      { success: false, error: error instanceof GhostAPIError ? error.message : 'Something went wrong' },
      { status: 400 },
    );
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
    <Box minHeight="100vh" backgroundColor="background" display="flex" justifyContent="center">
      <Box
        py="5%"
        px={{ base: 5, sm: 10 }}
        w="100%"
        maxWidth="70em"
        display="flex"
        flexDirection="column"
        alignItems={{ base: 'center', sm: 'start' }}
      >
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            Members
          </Heading>
        </Link>
        <Stack w="100%">
          <fetcher.Form method="post">
            {formMode === 'signup' && (
              <FormControl>
                <FormLabel color="secondary" fontSize="3xl">
                  Name
                </FormLabel>
                <Input name="name" placeholder="Enter your name" color="text1" />
              </FormControl>
            )}
            <FormControl>
              <FormLabel color="secondary" fontSize="3xl">
                Email
              </FormLabel>
              <Input name="email" placeholder="Enter your email" color="text1" />
            </FormControl>
            <Input type="hidden" name="emailType" value={formMode} />
            <Box
              display="flex"
              flexDirection={{ base: 'column-reverse', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              py={5}
              gap={{ base: 5, sm: 'unset' }}
            >
              <Box>
                <Text
                  color="text1"
                  onClick={() => setFormMode(formMode === 'signin' ? 'signup' : 'signin')}
                  sx={{ _hover: { color: 'primary' } }}
                  cursor="pointer"
                  textAlign={{ base: 'center', sm: 'left' }}
                >
                  {formMode === 'signin'
                    ? `Don't have an account? Sign up here!`
                    : 'Already have an account? Sign in here!'}
                </Text>
              </Box>
              <Button w={{ base: '100%', sm: 'unset' }} type="submit">
                Sign {formMode === 'signin' ? 'In' : 'Up'}
              </Button>
            </Box>
          </fetcher.Form>
        </Stack>
      </Box>
    </Box>
  );
}
