export type CopyResult =
  | { success: true; method: "clipboard-api" | "exec-command" }
  | { success: false; method: "manual-selection"; error?: Error };

/**
 * 3-tier clipboard copy helper:
 * 1. navigator.clipboard.writeText
 * 2. document.execCommand('copy') on textarea
 * 3. focus() and select() on targetTextarea for manual copy
 */
export async function copyToClipboard(
  text: string,
  targetTextarea?: HTMLTextAreaElement | null
): Promise<CopyResult> {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard-api" };
    } catch {
      // Permission denied or webview restriction; proceed to tier 2
    }
  }

  if (typeof document !== "undefined") {
    let created = false;
    let textarea = targetTextarea;

    try {
      if (!textarea) {
        textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.fontSize = "16px";
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.width = "2em";
        textarea.style.height = "2em";
        textarea.style.padding = "0";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";
        textarea.style.background = "transparent";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        created = true;
      }

      textarea.focus();

      if (
        typeof navigator !== "undefined" &&
        /ipad|iphone|ipod/i.test(navigator.userAgent)
      ) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textarea.setSelectionRange(0, 999999);
      } else {
        textarea.select();
        if (typeof textarea.setSelectionRange === "function") {
          textarea.setSelectionRange(0, text.length);
        }
      }

      const ok = document.execCommand("copy");
      if (ok) {
        return { success: true, method: "exec-command" };
      }
    } catch {
      // execCommand unavailable or failed; proceed to tier 3
    } finally {
      if (created && textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  }

  if (targetTextarea) {
    try {
      targetTextarea.focus();
      targetTextarea.select();
      if (typeof targetTextarea.setSelectionRange === "function") {
        targetTextarea.setSelectionRange(0, text.length);
      }
    } catch {
      // Ignore selection errors
    }
  }

  return { success: false, method: "manual-selection" };
}
