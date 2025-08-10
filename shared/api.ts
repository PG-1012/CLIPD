/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * News source options
 */
export type NewsSource = "bbc" | "reuters" | "npr";

/**
 * Individual headline/article data
 */
export interface Headline {
  title: string;
  summary: string;
  url: string;
  text: string;
}

/**
 * Headlines API response
 */
export interface HeadlinesResponse {
  headlines: Headline[];
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
}
