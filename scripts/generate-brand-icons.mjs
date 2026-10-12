import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(workspaceRoot, "..");
const brandAssetsDir = path.resolve(repoRoot, "docs/brand/designer-2026-10-09/Assets");
const publicIconsDir = path.resolve(workspaceRoot, "public/icons");
const publicDir = path.resolve(workspaceRoot, "public");
const appDir = path.resolve(workspaceRoot, "src/app");

fs.mkdirSync(publicIconsDir, { recursive: true });

const logomarkGreenSvgPath = path.resolve(brandAssetsDir, "Logomark Green.svg");
const logomarkLightGreenSvgPath = path.resolve(brandAssetsDir, "Logomark Light Green.svg");

const logomarkGreenSvg = fs.readFileSync(logomarkGreenSvgPath);
const logomarkLightGreenSvg = fs.readFileSync(logomarkLightGreenSvgPath);

// Helper to create an ICO buffer containing multiple PNG sizes
function createIcoBuffer(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(buf.length, 8); // bytes in res
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function generate() {
  console.log("Generating 0Seven brand icon assets from vector logomarks...");

  // 1. icon-192.png (Transparent standard PWA icon)
  // Height 160px on 192px square
  const icon192Inner = await sharp(logomarkGreenSvg)
    .resize({ height: 160, fit: "contain" })
    .toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon192Inner, gravity: "centre" }])
    .png()
    .toFile(path.resolve(publicIconsDir, "icon-192.png"));
  console.log("✓ Generated public/icons/icon-192.png");

  // 2. icon-512.png (Transparent standard PWA icon)
  // Height 426px on 512px square
  const icon512Inner = await sharp(logomarkGreenSvg)
    .resize({ height: 426, fit: "contain" })
    .toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon512Inner, gravity: "centre" }])
    .png()
    .toFile(path.resolve(publicIconsDir, "icon-512.png"));
  console.log("✓ Generated public/icons/icon-512.png");

  // 3. icon-maskable-192.png (Deep green #013920 background, Light Green logomark, 20% safe zone padding)
  // Height 118px on 192px square (fits inside 153px circle safe zone)
  const maskable192Inner = await sharp(logomarkLightGreenSvg)
    .resize({ height: 118, fit: "contain" })
    .toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 1, g: 57, b: 32, alpha: 1 }, // #013920
    },
  })
    .composite([{ input: maskable192Inner, gravity: "centre" }])
    .png()
    .toFile(path.resolve(publicIconsDir, "icon-maskable-192.png"));
  console.log("✓ Generated public/icons/icon-maskable-192.png");

  // 4. icon-maskable-512.png (Deep green #013920 background, Light Green logomark, 20% safe zone padding)
  // Height 314px on 512px square (fits inside 410px circle safe zone)
  const maskable512Inner = await sharp(logomarkLightGreenSvg)
    .resize({ height: 314, fit: "contain" })
    .toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 1, g: 57, b: 32, alpha: 1 }, // #013920
    },
  })
    .composite([{ input: maskable512Inner, gravity: "centre" }])
    .png()
    .toFile(path.resolve(publicIconsDir, "icon-maskable-512.png"));
  console.log("✓ Generated public/icons/icon-maskable-512.png");

  // 5. apple-touch-icon.png (180x180 opaque #013920 background with Light Green logomark)
  const appleTouchInner = await sharp(logomarkLightGreenSvg)
    .resize({ height: 120, fit: "contain" })
    .toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 1, g: 57, b: 32, alpha: 1 }, // #013920
    },
  })
    .composite([{ input: appleTouchInner, gravity: "centre" }])
    .png()
    .toFile(path.resolve(publicIconsDir, "apple-touch-icon.png"));
  console.log("✓ Generated public/icons/apple-touch-icon.png");

  // 6. Multi-resolution favicon.ico (16, 32, 48 px)
  const fav16 = await sharp(logomarkGreenSvg)
    .resize({ height: 14, width: 14, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 1, bottom: 1, left: 1, right: 1, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const fav32 = await sharp(logomarkGreenSvg)
    .resize({ height: 28, width: 28, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const fav48 = await sharp(logomarkGreenSvg)
    .resize({ height: 42, width: 42, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 3, bottom: 3, left: 3, right: 3, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const icoBuf = createIcoBuffer([fav16, fav32, fav48], [16, 32, 48]);
  fs.writeFileSync(path.resolve(publicDir, "favicon.ico"), icoBuf);
  fs.writeFileSync(path.resolve(appDir, "favicon.ico"), icoBuf);
  console.log("✓ Generated public/favicon.ico and src/app/favicon.ico");

  // 7. Vector favicon.svg
  fs.writeFileSync(path.resolve(publicDir, "favicon.svg"), logomarkGreenSvg);
  console.log("✓ Generated public/favicon.svg");

  console.log("All brand icon assets successfully generated!");
}

generate().catch((err) => {
  console.error("Error generating brand icons:", err);
  process.exit(1);
});
