const config = {
  appName: "Certcy",
  appDescription: "Hippo is a platform for .",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.certcy.space",
  authCallbackDomain: "https://certcy.space", // Base domain without www for auth callbacks
};

export default config;
