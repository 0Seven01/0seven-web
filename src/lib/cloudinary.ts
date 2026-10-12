const DEFAULT_CLOUD_NAME = "mdsiynsc";

// Sanitizes a Cloudinary public ID by stripping leading slashes and image extensions.
export function sanitizePublicId(publicId: string): string {
  if (!publicId) return "";
  let clean = publicId.trim().replace(/^\/+/, "");
  clean = clean.replace(/\.(webp|jpg|jpeg|png|avif|gif)$/i, "");
  return clean;
}

export interface CloudinaryUrlOptions {
  width?: number;
  quality?: number | "auto";
}

// Builds a Cloudinary delivery URL with format auto, quality auto, and optional width.
export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryUrlOptions = {}
): string {
  const cleanId = sanitizePublicId(publicId);
  if (!cleanId) return "";

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;

  const transforms: string[] = ["f_auto"];
  if (options.quality !== undefined) {
    transforms.push(`q_${options.quality}`);
  } else {
    transforms.push("q_auto");
  }

  if (options.width !== undefined && options.width > 0) {
    transforms.push(`w_${options.width}`);
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${cleanId}`;
}

// Generates an LQIP blur URL for Next.js blurDataURL placeholder.
export function buildCloudinaryLqipUrl(publicId: string): string {
  const cleanId = sanitizePublicId(publicId);
  if (!cleanId) return "";

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;

  return `https://res.cloudinary.com/${cloudName}/image/upload/q_10,w_20,e_blur:1000/${cleanId}`;
}
