/**
 * Generate a random short code for URL shortening
 * @param length - Length of the short code (default: 6)
 * @returns Random alphanumeric short code
 */
export function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate if a short code is valid
 * @param code - The short code to validate
 * @returns True if valid, false otherwise
 */
export function isValidShortCode(code: string): boolean {
  // Check if code is alphanumeric and within length limits
  const validPattern = /^[a-zA-Z0-9]{1,10}$/;
  return validPattern.test(code);
}

/**
 * Generate a custom short code (for future use)
 * @param customCode - Custom code provided by user
 * @returns Validated custom code or null if invalid
 */
export function generateCustomShortCode(customCode: string): string | null {
  if (!customCode || !isValidShortCode(customCode)) {
    return null;
  }
  return customCode.toLowerCase();
}