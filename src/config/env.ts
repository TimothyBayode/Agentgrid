type PublicEnv = {
  apiBaseUrl: string;
  privyAppId: string | undefined;
  cloudinaryCloudName: string | undefined;
  cloudinaryUploadPreset: string | undefined;
  chainId: number;
  chainName: string;
};

function optionalEnv(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

const configuredChainId = Number(import.meta.env["VITE_CHAIN_ID"] ?? 56);

export const env: PublicEnv = {
  apiBaseUrl: (import.meta.env["VITE_API_BASE_URL"] ?? "/api").replace(/\/$/, ""),
  privyAppId: optionalEnv(import.meta.env["VITE_PRIVY_APP_ID"]),
  cloudinaryCloudName: optionalEnv(import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"]),
  cloudinaryUploadPreset: optionalEnv(import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"]),
  chainId: Number.isInteger(configuredChainId) ? configuredChainId : 56,
  chainName: import.meta.env["VITE_CHAIN_NAME"] ?? "BNB Smart Chain",
};

export function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
