import { prisma } from '~/db.server';

interface GetSettingsValueParams {
  key: string;
  defaultValue: string;
}

export const getSettingsValue = async ({ key, defaultValue }: GetSettingsValueParams): Promise<string> => {
  const item = await prisma.settings.findFirst({
    where: {
      key,
    },
    select: {
      value: true,
    },
  });

  return item?.value ?? defaultValue;
};
