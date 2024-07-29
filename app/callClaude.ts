import { getAnthropic } from './getAnthopic.server';

export const callClaude = async (text: string): Promise<string> => {
  const anthropic = getAnthropic();
  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Summarize this text: ${text}`,
      },
    ],
    model: 'claude-3-haiku-20240307',
  });

  const messageContentFirst = message.content[0];

  if (messageContentFirst.type !== 'text') {
    throw new Error('Claude returned a non-text answer');
  }

  return messageContentFirst.text;
};
