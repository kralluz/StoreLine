import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "seu-secreto-super-seguro-mudeme-em-producao";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

const RESET_CODE_EXPIRY_MINUTES = 10;
const MAX_RESET_ATTEMPTS = 3;

export function generateResetCode(): string {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

export function getResetCodeExpiry(): Date {
  return new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);
}

export function isResetCodeExpired(expiry: Date): boolean {
  return new Date() >= expiry;
}

export { MAX_RESET_ATTEMPTS };