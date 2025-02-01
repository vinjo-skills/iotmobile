const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Copy the network security config file to the Android project
const withNetworkSecurityConfig = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const sourcePath = path.resolve(
        config.modRequest.projectRoot,
        "config/android/network_security_config.xml"
      );
      const destinationPath = path.resolve(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml/network_security_config.xml"
      );

      // Ensure the destination directory exists
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

      // Copy the file
      fs.copyFileSync(sourcePath, destinationPath);
      return config;
    },
  ]);
};

// Update AndroidManifest.xml to reference the network security config
const withAndroidNetworkSecurity = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application[0];

    // Add the network security config reference
    application.$["android:networkSecurityConfig"] =
      "@xml/network_security_config";

    return config;
  });
};

// Combine both plugins
module.exports = (config) => {
  config = withNetworkSecurityConfig(config);
  config = withAndroidNetworkSecurity(config);
  return config;
};
