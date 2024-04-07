import { ActionFunction, TypedResponse } from '@remix-run/node';
import axios, { AxiosResponse } from 'axios';
import { json } from 'react-router';
import { SummarizePostResponse } from '~/components/types';
import { env } from '~/env';

export const summarizePost: ActionFunction = async ({
  request,
  params,
}): Promise<TypedResponse<SummarizePostResponse>> => {
  try {
    const post = params.post;

    if (!post) {
      throw new Error('Empty post');
    }

    if (request.method !== 'POST') {
      throw new Error('Invalid Request');
    }

    const modelURL = env.LLM_URL;

    if (!modelURL) {
      throw new Error('Model URL not set');
    }

    const token = env.LLM_API_KEY;

    if (!token) {
      throw new Error('Model API key not set');
    }

    const response: AxiosResponse<{
      result: string;
    }> = await axios.post(modelURL, {
      command: 'summarize',
      token,
    });

    return json(response.data);
  } catch (error) {
    console.error(error);

    return json(
      {
        error: (error as Error).message,
      },
      {
        status: 400,
      },
    );
  }
};
