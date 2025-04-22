/**
 * Enhanced logging utility to help debug authentication issues
 * @param {string} source - The source of the log (function/file name)
 * @param {string} message - The message to log
 * @param {any} data - Optional data to include in the log
 * @param {string} level - Log level (info, warn, error)
 */
export const authLogger = (source, message, data = null, level = "info") => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] [AUTH:${source}]`;

  switch (level) {
    case "error":
      console.error(
        `${logPrefix} ERROR: ${message}`,
        data !== null ? data : ""
      );
      break;
    case "warn":
      console.warn(
        `${logPrefix} WARNING: ${message}`,
        data !== null ? data : ""
      );
      break;
    default:
      console.log(`${logPrefix} INFO: ${message}`, data !== null ? data : "");
  }

  // Add visual separator for easier log reading
  if (level === "error") {
    console.error(`${logPrefix} ${"=".repeat(50)}`);
  }
};
