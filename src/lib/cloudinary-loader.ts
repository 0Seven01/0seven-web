import { buildCloudinaryUrl } from "./cloudinary";

type CloudinaryLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

// Next.js custom image loader delegating to centralized Cloudinary URL builder.
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps): string {
  return buildCloudinaryUrl(src, { width, quality });
}
