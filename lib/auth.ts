import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "bpvp_sess";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET wajib diisi.");
  }

  return secret;
}

const b64u = (b: string) =>
  Buffer.from(b).toString("base64url");

function sign(payload: Session) {
  const body = b64u(JSON.stringify(payload));

  return (
    body +
    "." +
    crypto
      .createHmac("sha256", getSecret())
      .update(body)
      .digest("base64url")
  );
}

function verify(tok?: string): Session | null {
  if (!tok) return null;

  const [body, mac] = tok.split(".");

  if (!body || !mac) return null;

  const calc = crypto
    .createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");

  const a = Buffer.from(calc);
  const b = Buffer.from(mac);

  if (
    a.length !== b.length ||
    !crypto.timingSafeEqual(a, b)
  ) {
    return null;
  }

  try {
    const s = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as Session;

    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export function sessionCookie(
  payload: Omit<Session, "exp">
) {
  const tok = sign({
    ...payload,
    exp: Date.now() + 8 * 3600e3,
  });

  const prod =
    process.env.NODE_ENV === "production";

  return [
    `${COOKIE}=${tok}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${8 * 3600}`,
    ...(prod ? ["Secure"] : []),
  ].join("; ");
}

export function clearCookie() {
  const prod =
    process.env.NODE_ENV === "production";

  return [
    `${COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    ...(prod ? ["Secure"] : []),
  ].join("; ");
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  return verify(
    cookieStore.get(COOKIE)?.value
  );
}