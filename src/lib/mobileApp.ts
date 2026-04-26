const configuredDownloadUrl = import.meta.env.VITE_ANDROID_APP_URL?.trim() ?? "";
const baseUrl = import.meta.env.BASE_URL || "/";
const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
const fallbackPath = `${normalizedBaseUrl}downloads/studykro.apk`;

export const mobileAppDownload = {
  url: configuredDownloadUrl || fallbackPath,
  isConfigured: true,
  fallbackPath,
  isExternal: configuredDownloadUrl.length > 0,
};
