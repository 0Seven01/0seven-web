#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "../src/config/preorder.ts");

if (!fs.existsSync(configPath)) {
  console.error(`[check:placeholders] ERROR: Config file not found at ${configPath}`);
  process.exit(1);
}

const source = fs.readFileSync(configPath, "utf-8");

// Parse placeholder(...) entries in PREORDER_CONFIG
const placeholderRegex = /([a-zA-Z0-9_]+):\s*placeholder\(([\s\S]*?),\s*(?:\n\s*)?["']([^"']+)["']\s*\)/g;
const pendingPlaceholders = [];

let match;
while ((match = placeholderRegex.exec(source)) !== null) {
  const [, key, rawValue, label] = match;
  pendingPlaceholders.push({
    key: key.trim(),
    label: label.trim(),
    raw: rawValue.trim().replace(/\s+as\s+.*$/, ""),
  });
}

const isProduction = (process.env.VERCEL_ENV || "").trim() === "production";

// Validate NEXT_PUBLIC_WHATSAPP_NUMBER (P15)
const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const isNumberMissing = !rawNumber || !rawNumber.trim();
const isNumberPlaceholder = rawNumber
  ? /X{3,}/i.test(rawNumber) || rawNumber.toLowerCase().includes("placeholder")
  : false;
const sanitizedNumber = rawNumber ? rawNumber.trim().replace(/[\s+\-()]/g, "") : "";
const isNumberMalformed = rawNumber ? !/^\d{10,15}$/.test(sanitizedNumber) : false;
const isWhatsAppInvalid = isNumberMissing || isNumberPlaceholder || isNumberMalformed;

if (isWhatsAppInvalid) {
  if (isProduction) {
    console.error("\n=======================================================");
    console.error("  [check:placeholders] PRODUCTION BUILD BLOCKED (P15 / PR-EV2 / P-14)");
    console.error("=======================================================");
    if (isNumberMissing) {
      console.error("  Missing environment variable: NEXT_PUBLIC_WHATSAPP_NUMBER");
    } else if (isNumberPlaceholder) {
      console.error(`  Placeholder WhatsApp number detected: "${rawNumber}"`);
    } else {
      console.error(`  Malformed WhatsApp number detected: "${rawNumber}" (must be 10-15 digits E.164)`);
    }
    console.error("\nProduction deployments cannot ship with a missing, placeholder, or malformed WhatsApp number.");
    console.error("Configure Continental's WhatsApp number in Vercel before deploying.");
    console.error("=======================================================\n");
    process.exit(1);
  } else {
    console.warn("\n-------------------------------------------------------");
    console.warn("  [check:placeholders] PREVIEW / DEV BUILD WARNING (P15)");
    console.warn("-------------------------------------------------------");
    if (isNumberMissing) {
      console.warn("  NEXT_PUBLIC_WHATSAPP_NUMBER is missing.");
    } else if (isNumberPlaceholder) {
      console.warn(`  NEXT_PUBLIC_WHATSAPP_NUMBER is a placeholder: "${rawNumber}"`);
    } else {
      console.warn(`  NEXT_PUBLIC_WHATSAPP_NUMBER is malformed: "${rawNumber}"`);
    }
    console.warn("  Preview build will proceed. Checkout will show temporary Instagram notice.");
    console.warn("-------------------------------------------------------\n");
  }
}

if (pendingPlaceholders.length > 0) {
  if (isProduction) {
    console.error("\n=======================================================");
    console.error("  [check:placeholders] PRODUCTION BUILD BLOCKED (P-14)");
    console.error("=======================================================");
    console.error(`Found ${pendingPlaceholders.length} values still marked as PLACEHOLDER:`);
    for (const item of pendingPlaceholders) {
      console.error(`  - ${item.label} (${item.key}): ${item.raw}`);
    }
    console.error("\nProduction deployments cannot ship with placeholder data.");
    console.error("Confirm these values with Continental in asks/PO-1-preorder-launch.md before deploying.");
    console.error("=======================================================\n");
    process.exit(1);
  } else {
    console.warn("\n-------------------------------------------------------");
    console.warn("  [check:placeholders] PREVIEW / DEV BUILD WARNING");
    console.warn("-------------------------------------------------------");
    console.warn(`${pendingPlaceholders.length} values are currently provisional placeholders:`);
    for (const item of pendingPlaceholders) {
      console.warn(`  - ${item.label} (${item.key})`);
    }
    console.warn("Preview build proceeding with 'Preview — prices not final' banner.");
    console.warn("-------------------------------------------------------\n");
    process.exit(0);
  }
} else {
  console.log("\n[check:placeholders] SUCCESS: All campaign values confirmed. Zero placeholders remain.\n");
  process.exit(0);
}
