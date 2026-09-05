/* Rate limit in-memory sederhana — cukup untuk satu instance.
   Tahap 5: pindah ke Upstash Redis saat butuh multi-instance. */
const map = new Map<string, { n: number; ts: number }>();
export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const t = map.get(key) || { n: 0, ts: now };
  if (now - t.ts > windowMs) { t.n = 0; t.ts = now; }
  t.n++;
  map.set(key, t);
  return t.n > max;
}