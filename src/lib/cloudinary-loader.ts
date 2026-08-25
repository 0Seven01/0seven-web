type CloudinaryLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality ?? "auto"}`,
  ].join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${src}`;
}
