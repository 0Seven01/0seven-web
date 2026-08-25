export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 500
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) =>
        setTimeout(r, baseDelayMs * Math.pow(2, i))
      );
      // Delays: 500ms → 1000ms → 2000ms
    }
  }
  throw new Error("unreachable");
}
