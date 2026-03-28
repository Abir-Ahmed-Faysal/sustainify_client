/**
 * Image URL utilities for handling remote images and fallbacks
 */

/**
 * Check if an image URL is a valid/real image (not a placeholder)
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  // Exclude example.com and other placeholder domains
  if (url.includes("example.com")) return false;

  // Check for valid cloudinary URLs
  if (url.includes("res.cloudinary.com")) return true;

  // Check for other common valid image domains
  const validDomains = [
    "cloudinary.com",
    "unsplash.com",
    "pexels.com",
    "pixabay.com",
  ];

  return validDomains.some((domain) => url.includes(domain));
}

/**
 * Get a placeholder gradient based on a seed string
 */
export function getPlaceholderGradient(seed: string): string {
  const gradients = [
    "from-emerald-200 to-emerald-100",
    "from-blue-200 to-blue-100",
    "from-purple-200 to-purple-100",
    "from-pink-200 to-pink-100",
    "from-yellow-200 to-yellow-100",
    "from-green-200 to-green-100",
  ];

  const hash = seed.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return gradients[hash % gradients.length];
}
