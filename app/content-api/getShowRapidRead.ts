import { getSettingsValue } from './getSettingsValue';

export const getShowRapidRead = async (postType: string): Promise<boolean> => {
  const rapidReadSetting = await getSettingsValue({ key: 'rapid_read', defaultValue: 'off' });

  if (rapidReadSetting === 'off') return false;
  if (rapidReadSetting === 'all') return true;

  return postType === rapidReadSetting;
};
