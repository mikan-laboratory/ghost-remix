import { PrismaClient } from '@prisma/client';
import axios from 'axios';

export const summarizePosts = async (prisma: PrismaClient): Promise<void> => {
  const llmConfigured = process.env.LLM_URL && process.env.LLM_API_KEY;

  if (!llmConfigured) {
    console.log('LLM not configured; skipping summarization');
  }

  const posts = await prisma.posts.findMany({
    where: {
      status: {
        equals: 'published',
      },
    },
    select: {
      html: true,
    },
  });

  const settledPosts = await Promise.allSettled(
    posts.map((post) => {
      return axios.post(process.env.LLM_API_URL as string, {
        command: 'summarize',
        token: process.env.LLM_API_KEY,
        text: post.html,
      });
    }),
  );

  const successfulPosts = settledPosts.filter((result) => result.status === 'fulfilled');

  console.log(`Summarized ${successfulPosts.length}/${posts.length}`);
};
