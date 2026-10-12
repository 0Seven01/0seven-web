import { z } from "zod";

export function sanitizePhoneNumber(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().replace(/[\s\-\(\)\.]/g, "");
}

export const NIGERIAN_PHONE_REGEX = /^(?:\+?2340?|0)([789][01]\d{8})$/;

export function normalizeNigerianPhone(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = sanitizePhoneNumber(raw);
  const match = cleaned.match(NIGERIAN_PHONE_REGEX);
  if (!match) return null;
  return `0${match[1]}`;
}

export const customerDetailsSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name"),
    phone: z
      .string()
      .trim()
      .refine(
        (val) => normalizeNigerianPhone(val) !== null,
        {
          message: "Enter an 11-digit phone number, e.g. 08012345678",
        }
      ),
    deliveryMethod: z.enum(["pickup", "delivery"] as const),
    deliveryAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery") {
      const address = data.deliveryAddress ? data.deliveryAddress.trim() : "";
      if (address.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["deliveryAddress"],
          message: "Enter your delivery area or address",
        });
      }
    }
  });

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
