const CDN_URL =
    process.env.NEXT_PUBLIC_CDN_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000';

/**
 * Builds a fully-qualified URL for an uploaded image.
 * Prefers the Cloudflare CDN if configured, falling back to the raw
 * API origin so local dev (no CDN) keeps working unchanged.
 */
export function mediaUrl(path: string): string {
    return path.startsWith('http') ? path : `${CDN_URL}${path}`;
}