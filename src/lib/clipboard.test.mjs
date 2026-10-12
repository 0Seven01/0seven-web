import test from "node:test";
import assert from "node:assert/strict";
import { copyToClipboard } from "./clipboard.ts";

test("Tier 1: copyToClipboard succeeds via navigator.clipboard.writeText", async () => {
  let textWritten = "";
  const mockClipboard = {
    writeText: async (text) => {
      textWritten = text;
    },
  };

  const origClipboardDesc = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "clipboard"
  );

  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: mockClipboard,
    configurable: true,
    writable: true,
  });

  try {
    const result = await copyToClipboard("PRE-ORDER 0S-PO-ABC123");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.method, "clipboard-api");
    assert.strictEqual(textWritten, "PRE-ORDER 0S-PO-ABC123");
  } finally {
    if (origClipboardDesc) {
      Object.defineProperty(globalThis.navigator, "clipboard", origClipboardDesc);
    } else {
      delete globalThis.navigator.clipboard;
    }
  }
});

test("Tier 2: copyToClipboard falls back to document.execCommand when writeText rejects", async () => {
  const mockClipboard = {
    writeText: async () => {
      throw new Error("NotAllowedError: write permission denied in webview");
    },
  };

  const origClipboardDesc = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "clipboard"
  );

  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: mockClipboard,
    configurable: true,
    writable: true,
  });

  let execCommandCalled = false;
  let appended = false;
  let removed = false;

  const mockDocument = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      focus: () => {},
      select: () => {},
      setSelectionRange: () => {},
      parentNode: {
        removeChild: () => {
          removed = true;
        },
      },
    }),
    body: {
      appendChild: () => {
        appended = true;
      },
      removeChild: () => {},
    },
    execCommand: (command) => {
      if (command === "copy") {
        execCommandCalled = true;
        return true;
      }
      return false;
    },
  };

  const origDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    configurable: true,
    writable: true,
  });

  try {
    const result = await copyToClipboard("PRE-ORDER 0S-PO-XYZ789");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.method, "exec-command");
    assert.strictEqual(execCommandCalled, true);
    assert.strictEqual(appended, true);
    assert.strictEqual(removed, true);
  } finally {
    if (origClipboardDesc) {
      Object.defineProperty(globalThis.navigator, "clipboard", origClipboardDesc);
    } else {
      delete globalThis.navigator.clipboard;
    }

    if (origDocumentDesc) {
      Object.defineProperty(globalThis, "document", origDocumentDesc);
    } else {
      delete globalThis.document;
    }
  }
});

test("Tier 2: copyToClipboard falls back to document.execCommand when navigator.clipboard is undefined", async () => {
  const origClipboardDesc = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "clipboard"
  );

  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: undefined,
    configurable: true,
    writable: true,
  });

  let execCommandCalled = false;
  const mockDocument = {
    createRange: () => ({
      selectNodeContents: () => {},
    }),
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      focus: () => {},
      select: () => {},
      setSelectionRange: () => {},
      parentNode: {
        removeChild: () => {},
      },
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
    execCommand: (command) => {
      if (command === "copy") {
        execCommandCalled = true;
        return true;
      }
      return false;
    },
  };

  const origDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    configurable: true,
    writable: true,
  });

  const origWindowDesc = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    value: {
      getSelection: () => ({
        removeAllRanges: () => {},
        addRange: () => {},
      }),
    },
    configurable: true,
    writable: true,
  });

  try {
    const result = await copyToClipboard("PRE-ORDER 0S-PO-IPHONE1");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.method, "exec-command");
    assert.strictEqual(execCommandCalled, true);
  } finally {
    if (origClipboardDesc) {
      Object.defineProperty(globalThis.navigator, "clipboard", origClipboardDesc);
    } else {
      delete globalThis.navigator.clipboard;
    }

    if (origDocumentDesc) {
      Object.defineProperty(globalThis, "document", origDocumentDesc);
    } else {
      delete globalThis.document;
    }

    if (origWindowDesc) {
      Object.defineProperty(globalThis, "window", origWindowDesc);
    } else {
      delete globalThis.window;
    }
  }
});

test("Tier 3: copyToClipboard focuses and selects targetTextarea when execCommand fails", async () => {
  const origClipboardDesc = Object.getOwnPropertyDescriptor(
    globalThis.navigator,
    "clipboard"
  );

  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: undefined,
    configurable: true,
    writable: true,
  });

  const mockDocument = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      focus: () => {},
      select: () => {},
      setSelectionRange: () => {},
      parentNode: { removeChild: () => {} },
    }),
    body: { appendChild: () => {}, removeChild: () => {} },
    execCommand: () => false,
  };

  const origDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    configurable: true,
    writable: true,
  });

  let focused = false;
  let selected = false;
  let rangeStart = -1;
  let rangeEnd = -1;

  const mockTextarea = {
    focus: () => {
      focused = true;
    },
    select: () => {
      selected = true;
    },
    setSelectionRange: (start, end) => {
      rangeStart = start;
      rangeEnd = end;
    },
  };

  try {
    const text = "PRE-ORDER 0S-PO-MANUAL";
    const result = await copyToClipboard(text, mockTextarea);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.method, "manual-selection");
    assert.strictEqual(focused, true);
    assert.strictEqual(selected, true);
    assert.strictEqual(rangeStart, 0);
    assert.strictEqual(rangeEnd, text.length);
  } finally {
    if (origClipboardDesc) {
      Object.defineProperty(globalThis.navigator, "clipboard", origClipboardDesc);
    } else {
      delete globalThis.navigator.clipboard;
    }

    if (origDocumentDesc) {
      Object.defineProperty(globalThis, "document", origDocumentDesc);
    } else {
      delete globalThis.document;
    }
  }
});
