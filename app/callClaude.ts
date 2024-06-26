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

  return message.content[0].text;
};
