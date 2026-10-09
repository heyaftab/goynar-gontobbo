import { createPublicKey, verify as verifySignature, type JsonWebKey } from "node:crypto";

interface GoogleJwk extends JsonWebKey {
  kid?: string;
  alg?: string;
  use?: string;
}

export interface GoogleClaims {
  aud?: string;
  iss?: string;
  exp?: number;
  iat?: number;
  sub?: string;
  name?: string;
  email?: string;
  email_verified?: boolean | string;
}

let cachedKeys: GoogleJwk[] = [];
let keyCacheExpiresAt = 0;

async function getGoogleSigningKeys(): Promise<GoogleJwk[]> {
  if (cachedKeys.length && Date.now() < keyCacheExpiresAt) return cachedKeys;

  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Google signing keys could not be fetched");

  const payload = await response.json() as { keys?: GoogleJwk[] };
  if (!Array.isArray(payload.keys)) throw new Error("Google signing keys response was invalid");

  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] ?? 300);
  cachedKeys = payload.keys;
  keyCacheExpiresAt = Date.now() + maxAge * 1000;
  return cachedKeys;
}

function decodeTokenPart<T>(part: string): T {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as T;
}

export async function verifyGoogleIdToken(token: string, clientId: string): Promise<GoogleClaims | null> {
  const [encodedHeader, encodedClaims, encodedSignature, extra] = token.split(".");
  if (!encodedHeader || !encodedClaims || !encodedSignature || extra) return null;

  let header: { alg?: string; kid?: string };
  let claims: GoogleClaims;
  try {
    header = decodeTokenPart(encodedHeader);
    claims = decodeTokenPart(encodedClaims);
  } catch {
    return null;
  }

  if (header.alg !== "RS256" || !header.kid) return null;
  const signingKey = (await getGoogleSigningKeys()).find((key) => key.kid === header.kid && key.alg === "RS256" && key.use === "sig");
  if (!signingKey) return null;

  const publicKey = createPublicKey({ key: signingKey, format: "jwk" });
  const validSignature = verifySignature(
    "RSA-SHA256",
    Buffer.from(`${encodedHeader}.${encodedClaims}`),
    publicKey,
    Buffer.from(encodedSignature, "base64url"),
  );
  if (!validSignature) return null;

  const issuerIsValid = claims.iss === "accounts.google.com" || claims.iss === "https://accounts.google.com";
  const isExpired = typeof claims.exp !== "number" || claims.exp <= Math.floor(Date.now() / 1000);
  const audienceMatches = claims.aud === clientId;
  const emailIsVerified = claims.email_verified === true || claims.email_verified === "true";
  if (!issuerIsValid || isExpired || !audienceMatches || !emailIsVerified || !claims.sub || !claims.email || !claims.name) return null;

  return claims;
}
