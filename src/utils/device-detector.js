"use client";

// Detect if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Detect Android devices using User Agent
export const isAndroid = () => {
  if (!isBrowser) return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/i.test(userAgent);
};

// Safe wrapper for client-side operations
export const runOnClient = (fn, fallback = undefined) => {
  if (isBrowser) {
    return fn();
  }
  return fallback;
};

// Export a function that provides animation props based on device
export const getAnimationProps = (
  animationProps,
  disabledProps = { initial: {}, animate: {}, transition: {} }
) => {
  return runOnClient(
    () => (isAndroid() ? disabledProps : animationProps),
    disabledProps
  );
};

// Utility for conditionally applying framer-motion variants
export const getVariantProps = (variants, variant, disabledProps = {}) => {
  return runOnClient(() => {
    return isAndroid() ? disabledProps : { variants, animate: variant };
  }, disabledProps);
};
