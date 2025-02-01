const { withAndroidManifest } = require("@expo/config-plugins");

const withCustomPermissions = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }

    // Add INTERNET permission (if not already added)
    if (
      !manifest["uses-permission"].some(
        (p) => p.$["android:name"] === "android.permission.INTERNET"
      )
    ) {
      manifest["uses-permission"].push({
        $: {
          "android:name": "android.permission.INTERNET",
        },
      });
    }

    // Add ACCESS_NETWORK_STATE permission
    if (
      !manifest["uses-permission"].some(
        (p) => p.$["android:name"] === "android.permission.ACCESS_NETWORK_STATE"
      )
    ) {
      manifest["uses-permission"].push({
        $: {
          "android:name": "android.permission.ACCESS_NETWORK_STATE",
        },
      });
    }

    return config;
  });
};

module.exports = withCustomPermissions;
