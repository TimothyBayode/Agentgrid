import { env, requireEnv } from "@/config/env";
import type { UploadAsset } from "@/integrations/types";

export function cloudinaryAssetUrl(publicId: string, transformation = "f_auto,q_auto") {
  const cloudName = env.cloudinaryCloudName;
  if (!cloudName) return publicId;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
}

export async function uploadImage(file: File): Promise<UploadAsset> {
  const cloudName = requireEnv(env.cloudinaryCloudName, "VITE_CLOUDINARY_CLOUD_NAME");
  const uploadPreset = requireEnv(env.cloudinaryUploadPreset, "VITE_CLOUDINARY_UPLOAD_PRESET");
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) throw new Error("Cloudinary upload failed");
  const asset = (await response.json()) as {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
  };
  return {
    secureUrl: asset.secure_url,
    publicId: asset.public_id,
    ...(asset.width === undefined ? {} : { width: asset.width }),
    ...(asset.height === undefined ? {} : { height: asset.height }),
  };
}
