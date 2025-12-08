
export function navigateWithParams(
  navigation,
  screenName,
  route,
  newParams = {}
) {
  const accumulatedParams = route?.params || {};
  navigation.navigate(screenName, {
    ...accumulatedParams,
    ...newParams,
  });
}
