export const extractImageCode = (imageUrl: string): string => {
  const url = new URL(imageUrl);
  const path = url.pathname;
  const code = path.split('/').pop().split('.')[0];
  return code;
};
