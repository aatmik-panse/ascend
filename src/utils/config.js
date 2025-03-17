const config = {
    appName: "Hippo",
    appDescription:
      "Hippo is a platform for .",
    domainName:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://hippo.com",
  };
  
  
  export default config;
  