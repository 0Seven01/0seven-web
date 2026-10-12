import test from "node:test";
import assert from "node:assert/strict";
import {
  generateOrderReference,
  buildPreorderMessage,
  WhatsAppCheckout,
  getWhatsAppNumber,
  UNAMBIGUOUS_ALPHABET,
} from "./checkout.ts";

test("generateOrderReference generates standard 0S-PO- prefix with 6 characters", () => {
  const ref = generateOrderReference();
  assert.match(ref, /^0S-PO-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
});

test("generateOrderReference never contains ambiguous characters (0, O, 1, I) across 1,000 iterations", () => {
  const ambiguousRegex = /[0O1I]/;
  for (let i = 0; i < 1000; i++) {
    const ref = generateOrderReference();
    const code = ref.replace("0S-PO-", "");
    assert.strictEqual(
      ambiguousRegex.test(code),
      false,
      `Reference "${ref}" contained ambiguous characters`
    );
    for (const char of code) {
      assert.ok(
        UNAMBIGUOUS_ALPHABET.includes(char),
        `Character "${char}" not in unambiguous alphabet`
      );
    }
  }
});

test("buildPreorderMessage creates exact formatted message snapshot for single item pickup", () => {
  const mockCart = [
    {
      variantId: "v-forgiven-black-l",
      productId: "forgiven",
      productName: "Forgiven",
      slug: "forgiven",
      categorySlug: "t-shirts",
      size: "L",
      colourName: "Black",
      colourHex: "#000000",
      priceKobo: 1500000,
      quantity: 1,
      imageUrl: "forgiven--black-hanger",
    },
  ];

  const mockCustomer = {
    fullName: "Tobi Continental",
    phone: "08012345678",
    deliveryMethod: "pickup",
  };

  const message = buildPreorderMessage({
    cart: mockCart,
    customer: mockCustomer,
    reference: "0S-PO-H7K93A",
    paymentWording: "Full payment by bank transfer after confirmation",
    eventDate: "26 Oct",
  });

  const expected = [
    "PRE-ORDER — Ref: 0S-PO-H7K93A",
    "",
    "1. Forgiven — Black, L ×1 — ₦15,000",
    "",
    "Total: ₦15,000",
    "",
    "Name: Tobi Continental",
    "Phone: 08012345678",
    "Collection: Pickup at 26 Oct event",
    "Payment: Full payment by bank transfer after confirmation",
  ].join("\n");

  assert.strictEqual(message, expected);
});

test("buildPreorderMessage creates exact formatted message snapshot for multi-item delivery", () => {
  const mockCart = [
    {
      variantId: "v-forgiven-white-m",
      productId: "forgiven",
      productName: "Forgiven",
      slug: "forgiven",
      categorySlug: "t-shirts",
      size: "M",
      colourName: "White",
      colourHex: "#FFFFFF",
      priceKobo: 1500000,
      quantity: 2,
      imageUrl: "forgiven--white-lookbook",
    },
    {
      variantId: "v-justified-green-xl",
      productId: "justified",
      productName: "Justified",
      slug: "justified",
      categorySlug: "t-shirts",
      size: "XL",
      colourName: "Green",
      colourHex: "#013920",
      priceKobo: 1500000,
      quantity: 1,
      imageUrl: "justified--green-hanger",
    },
  ];

  const mockCustomer = {
    fullName: "Iseoluwa Adeleke",
    phone: "08098765432",
    deliveryMethod: "delivery",
    deliveryAddress: "14 Victoria Island, Lagos",
  };

  const message = buildPreorderMessage({
    cart: mockCart,
    customer: mockCustomer,
    reference: "0S-PO-7B8N4X",
    paymentWording: "Full payment by bank transfer after confirmation",
    eventDate: "26 Oct",
  });

  const expected = [
    "PRE-ORDER — Ref: 0S-PO-7B8N4X",
    "",
    "1. Forgiven — White, M ×2 — ₦30,000",
    "2. Justified — Green, XL ×1 — ₦15,000",
    "",
    "Total: ₦45,000",
    "",
    "Name: Iseoluwa Adeleke",
    "Phone: 08098765432",
    "Collection: Lagos Delivery (14 Victoria Island, Lagos)",
    "Payment: Full payment by bank transfer after confirmation",
  ].join("\n");

  assert.strictEqual(message, expected);
});

test("buildPreorderMessage safely formats message when customer details are omitted", () => {
  const mockCart = [
    {
      variantId: "v-im-righteous-black-s",
      productId: "im-righteous",
      productName: "I'm Righteous",
      slug: "im-righteous",
      categorySlug: "t-shirts",
      size: "S",
      colourName: "Black",
      colourHex: "#000000",
      priceKobo: 1500000,
      quantity: 1,
      imageUrl: "im-righteous--black-model",
    },
  ];

  const message = buildPreorderMessage({
    cart: mockCart,
    reference: "0S-PO-99XW22",
  });

  const expected = [
    "PRE-ORDER — Ref: 0S-PO-99XW22",
    "",
    "1. I'm Righteous — Black, S ×1 — ₦15,000",
    "",
    "Total: ₦15,000",
    "",
    "Payment: Full payment by bank transfer after confirmation",
  ].join("\n");

  assert.strictEqual(message, expected);
});

test("WhatsAppCheckout fails closed when offline", async () => {
  const checkout = new WhatsAppCheckout();
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "onLine"
  );

  Object.defineProperty(globalThis.navigator, "onLine", {
    value: false,
    configurable: true,
    writable: true,
  });

  try {
    await assert.rejects(
      async () => {
        await checkout.checkout([]);
      },
      {
        name: "Error",
        message: "Cannot checkout while offline.",
      }
    );
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis.navigator, "onLine", originalDescriptor);
    }
  }
});

test("WhatsAppCheckout fails closed when WhatsApp number is missing", async () => {
  const checkout = new WhatsAppCheckout();
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const originalDescriptor = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "onLine"
  );

  Object.defineProperty(globalThis.navigator, "onLine", {
    value: true,
    configurable: true,
    writable: true,
  });

  try {
    await assert.rejects(
      async () => {
        await checkout.checkout([]);
      },
      {
        name: "Error",
        message: "Ordering is temporarily unavailable — please contact us on Instagram.",
      }
    );
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    if (originalDescriptor) {
      Object.defineProperty(globalThis.navigator, "onLine", originalDescriptor);
    }
  }
});

test("WhatsAppCheckout constructs and URL-encodes complete wa.me link with recovery flag", async () => {
  const checkout = new WhatsAppCheckout();
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "2347034306187";

  const originalDescriptor = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "onLine"
  );

  Object.defineProperty(globalThis.navigator, "onLine", {
    value: true,
    configurable: true,
    writable: true,
  });

  let openedUrl = null;
  const originalOpen = globalThis.window?.open;
  const localStorageStore = {};

  globalThis.localStorage = {
    setItem: (key, val) => {
      localStorageStore[key] = String(val);
    },
    getItem: (key) => localStorageStore[key] ?? null,
    removeItem: (key) => {
      delete localStorageStore[key];
    },
  };

  globalThis.window = {
    open: (url) => {
      openedUrl = url;
    },
  };

  const mockCart = [
    {
      variantId: "v-god-navy-m",
      productId: "god-is-always-in-control",
      productName: "God is always in Control",
      slug: "god-is-always-in-control",
      categorySlug: "t-shirts",
      size: "M",
      colourName: "Navy",
      colourHex: "#000080",
      priceKobo: 1500000,
      quantity: 1,
      imageUrl: "god-is-always-in-control--navy-model",
    },
  ];

  try {
    await checkout.checkout(
      mockCart,
      {
        fullName: "Test Buyer & Co.",
        phone: "08012345678",
        deliveryMethod: "delivery",
        deliveryAddress: "Flat 2, O'Connor Street, Lagos",
      },
      { reference: "0S-PO-REF123" }
    );

    assert.ok(openedUrl, "window.open was not called");
    assert.ok(openedUrl.startsWith("https://wa.me/2347034306187?text="));
    assert.strictEqual(localStorageStore["0s_checkout_initiated"], "true");

    const queryText = new URL(openedUrl).searchParams.get("text");
    assert.ok(queryText.includes("PRE-ORDER — Ref: 0S-PO-REF123"));
    assert.ok(
      queryText.includes("1. God is always in Control — Navy, M ×1 — ₦15,000")
    );
    assert.ok(queryText.includes("Name: Test Buyer & Co."));
    assert.ok(
      queryText.includes(
        "Collection: Lagos Delivery (Flat 2, O'Connor Street, Lagos)"
      )
    );
    assert.ok(
      queryText.includes(
        "Payment: Full payment by bank transfer after confirmation"
      )
    );
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis.navigator, "onLine", originalDescriptor);
    }
    if (originalOpen) globalThis.window.open = originalOpen;
  }
});

test("WhatsAppCheckout fails closed when pre-orders are closed", async () => {
  const checkout = new WhatsAppCheckout();
  const mockCart = [
    {
      variantId: "v-test",
      productId: "test-product",
      productName: "Test Product",
      slug: "test-product",
      categorySlug: "t-shirts",
      size: "M",
      colourName: "Black",
      colourHex: "#000000",
      priceKobo: 1500000,
      quantity: 1,
      imageUrl: "test-img",
    },
  ];

  const originalWindow = globalThis.window;
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "onLine"
  );

  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "2347034306187";
  Object.defineProperty(globalThis.navigator, "onLine", {
    value: true,
    configurable: true,
  });
  globalThis.window = {
    location: { search: "?preorder=closed", hostname: "localhost" },
    open: () => {},
  };

  try {
    await assert.rejects(
      async () => {
        await checkout.checkout(mockCart);
      },
      {
        message: "Pre-orders have closed for this campaign.",
      }
    );
  } finally {
    globalThis.window = originalWindow;
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    if (originalDescriptor) {
      Object.defineProperty(globalThis.navigator, "onLine", originalDescriptor);
    }
  }
});

test("getWhatsAppNumber returns configured number", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "2347034306187";
  try {
    assert.strictEqual(getWhatsAppNumber(), "2347034306187");
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
  }
});

test("getWhatsAppNumber fails closed when environment variable is missing", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  try {
    assert.throws(
      () => {
        getWhatsAppNumber();
      },
      {
        name: "Error",
        message: "Ordering is temporarily unavailable — please contact us on Instagram.",
      }
    );
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
  }
});

test("getWhatsAppNumber fails closed when environment variable is empty string", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "";
  try {
    assert.throws(
      () => {
        getWhatsAppNumber();
      },
      {
        name: "Error",
        message: "Ordering is temporarily unavailable — please contact us on Instagram.",
      }
    );
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
  }
});

test("getWhatsAppNumber fails closed when environment variable is whitespace-only", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "    ";
  try {
    assert.throws(
      () => {
        getWhatsAppNumber();
      },
      {
        name: "Error",
        message: "Ordering is temporarily unavailable — please contact us on Instagram.",
      }
    );
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
  }
});

test("getWhatsAppNumber fails closed when environment variable contains placeholder X's", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "234XXXXXXXXXX";
  try {
    assert.throws(
      () => {
        getWhatsAppNumber();
      },
      {
        name: "Error",
        message: "Ordering is temporarily unavailable — please contact us on Instagram.",
      }
    );
  } finally {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
  }
});

test("getWhatsAppNumber fails closed when environment variable is malformed (non-digits or invalid length)", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const invalidNumbers = ["12345", "not-a-phone", "080123", "234703430618799999"];
  for (const invalid of invalidNumbers) {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = invalid;
    try {
      assert.throws(
        () => {
          getWhatsAppNumber();
        },
        {
          name: "Error",
          message: "Ordering is temporarily unavailable — please contact us on Instagram.",
        }
      );
    } finally {
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    }
  }
});

test("getWhatsAppNumber normalizes formatted number (strips +, spaces, hyphens)", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const formattedVariations = [
    "+234 703 430 6187",
    "+234-703-430-6187",
    "(+234) 703 430 6187",
    "234 703 430 6187",
  ];
  for (const formatted of formattedVariations) {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = formatted;
    try {
      assert.strictEqual(getWhatsAppNumber(), "2347034306187");
    } finally {
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    }
  }
});

test("WhatsAppCheckout fails closed when WhatsApp number is malformed or placeholder", async () => {
  const checkout = new WhatsAppCheckout();
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "onLine"
  );

  Object.defineProperty(globalThis.navigator, "onLine", {
    value: true,
    configurable: true,
    writable: true,
  });

  const badNumbers = ["234XXXXXXXXXX", "malformed-number", "   ", ""];
  for (const badNumber of badNumbers) {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = badNumber;
    try {
      await assert.rejects(
        async () => {
          await checkout.checkout([]);
        },
        {
          name: "Error",
          message: "Ordering is temporarily unavailable — please contact us on Instagram.",
        }
      );
    } finally {
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    }
  }

  if (originalDescriptor) {
    Object.defineProperty(globalThis.navigator, "onLine", originalDescriptor);
  }
});



