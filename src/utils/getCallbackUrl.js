/**
 * Returns the appropriate callback URL based on the environment
 * Uses window.location.origin if available (client-side) for maximum compatibility
 * Falls back to environment variables if not (server-side)
 * @returns {string} The appropriate callback URL for the current environment
 */
export function getCallbackUrl() {
  let url = "";
  let source = "";

  // If we're in the browser, use the current URL origin for maximum compatibility
  if (typeof window !== "undefined") {
    url = window.location.origin;
    source = "browser-window-origin";
  } else {
    // If we're on the server, use environment variables based on NODE_ENV
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      url =
        process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL_DEV ||
        "http://localhost:3000";
      source = "env-dev-url";
    } else {
      url =
        process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL_PROD ||
        "https://certcy.space";
      source = "env-prod-url";
    }
  }

  // Simple console log
  console.log(`Auth callback URL: ${url}`);
  return url;
}
