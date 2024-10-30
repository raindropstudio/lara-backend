export const extractImageCode = (imageUrl: string | undefined | null): string | null => {
  if (!imageUrl) return null;

  const url = new URL(imageUrl);
  const path = url.pathname;
  const code = path.split('/').pop()?.split('.')[0];
  return code || null;
};
