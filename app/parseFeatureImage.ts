export const parseFeatureImage = (featureImageURL: string): string => {
  if (featureImageURL.includes('__GHOST_URL__')) {
    return featureImageURL.replace('__GHOST_URL__', '');
  }

  return featureImageURL;
};
