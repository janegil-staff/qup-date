import Constants from "expo-constants";

export function getBaseUrl() {
  const host = Constants.expoConfig?.hostUri;

  if (!host) {
    console.warn("Could not detect LAN IP, falling back to localhost");
    return "https://qup.dating";
  }

  const lanIp = host.split(":")[0];
  return `http://${lanIp}:3000`;
}
