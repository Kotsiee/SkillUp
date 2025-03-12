// decodeBase64.ts

/**
 * Decodes a "data:text/plain;base64,..." string to raw text.
 *
 * @param base64Data The full data URL string, e.g. "data:text/plain;base64,SGVsbG8sIHdvcmxkIQ=="
 * @returns A Promise resolving to the decoded text.
 *
 * Usage Example:
 *   const text = decodeBase64("data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==");
 *   console.log(text); // "Hello, world!"
 */
export function decodeBase64(base64Data: string): string {
    // 1. Split on the comma, ignoring the prefix "data:text/plain;base64,"
    const parts = base64Data.split(",");
    if (parts.length < 2) {
      throw new Error("Invalid data URL. No base64 content found.");
    }
  
    // 2. Extract the base64-encoded part
    const base64Content = parts[1];
  
    // 3. Decode using the browser's built-in 'atob'
    // For Deno or Node, see notes below
    const decoded = atob(base64Content);
  
    return decoded;
  }
  