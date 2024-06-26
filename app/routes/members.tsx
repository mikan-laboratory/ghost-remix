//External Library Imports
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, useUpdateEffect, VStack } from '@chakra-ui/react';
import { json, MetaFunction, ActionFunctionArgs, TypedResponse, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData, Link } from '@remix-run/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
//Internal Module Imports
import { env } from '~/env';
import { setCookie } from '~/setCookie.server';
import { GhostSignInErrorResponse, GhostSignInResponse, GhostAPIError } from './types';
import { getSettingsValue } from '~/content-api/getSettingsValue';
import { PageBase } from '~/components/PageBase';

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

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<
  TypedResponse<{
    success: boolean;
    error?: string;
  }>
> => {
  try {
    const body = await request.formData();
    const email = body.get('email');
    const name = body.get('name');
    const emailType = body.get('emailType');

    if (emailType === 'signup') {
      const memberSignupSetting = await getSettingsValue({ key: 'members_signup_access', defaultValue: 'none' });

      if (memberSignupSetting !== 'all') {
        return json({ success: false, error: 'Signup disabled' }, { status: 400 });
      }

      if (!name) {
        return json({ success: false, error: 'Name is required for signup' }, { status: 400 });
      }
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
        headers: {
          'X-Forwarded-Proto': 'https',
        },
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

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<
  TypedResponse<{
    authenticated: boolean;
    error?: string;
  }>
> => {
  return setCookie(request);
};

export default function MembersPage() {
  const fetcher = useFetcher<typeof action>();
  const data = useLoaderData<typeof loader>();
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signin');
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
    if (fetcher.data?.success) {
      toast({
        title: 'Email sent!',
        description: 'Check your email for the magic link.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
    if (fetcher.data?.error) {
      toast({
        title: 'Error',
        description: fetcher.data.error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [fetcher.data]);

  return (
    <PageBase hideSignup={true}>
      <VStack spacing={8} align="stretch" w="100%" maxW="500px" mx="auto" mt={10} px={4}>
        <Text fontSize="3xl" fontWeight="bold" color="primary" textAlign="center">
          {formMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Text>
        <fetcher.Form method="post">
          <Stack spacing={6}>
            {formMode === 'signup' && (
              <FormControl>
                <FormLabel color="primary" fontSize="lg">
                  Name
                </FormLabel>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  color="text1"
                  size="lg"
                  borderColor="text2"
                  _hover={{ borderColor: 'primary' }}
                  _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px #0080a8' }}
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel color="primary" fontSize="lg">
                Email
              </FormLabel>
              <Input
                name="email"
                placeholder="Enter your email"
                color="text1"
                size="lg"
                borderColor="text2"
                _hover={{ borderColor: 'primary' }}
                _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px #0080a8' }}
              />
            </FormControl>
            <Input type="hidden" name="emailType" value={formMode} />
            <Box
              display="flex"
              flexDirection={{ base: 'column-reverse', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
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
              <Button
                color="white"
                backgroundColor={'tertiary'}
                sx={{
                  ':hover': {
                    bg: 'tertiary2',
                  },
                }}
                w={{ base: '100%', sm: 'unset' }}
                type="submit"
              >
                Sign {formMode === 'signin' ? 'In' : 'Up'}
              </Button>
            </Box>
          </Stack>
        </fetcher.Form>
      </VStack>
    </PageBase>
  );
}
