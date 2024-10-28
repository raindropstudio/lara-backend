export const extractImageCode = (imageUrl: string | undefined | null): string | null => {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const path = url.pathname;
    const code = path.split('/').pop()?.split('.')[0];
    return code || null;
  } catch (e) {
    console.warn('Failed to extract image code from URL:', imageUrl);
    return null;
  }
};
