import { makeRedirectUri } from "expo-auth-session";

const redirectUri = makeRedirectUri({
  useProxy: true,
});

console.log("Redirect URI:", redirectUri);

const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: GOOGLE_WEB_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  redirectUri,
});