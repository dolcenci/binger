// ---------------------------------------------------------
// JWT helpers — sign and verify tokens.
// The secret lives in .env (JWT_SECRET).
// ---------------------------------------------------------
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET) {
    // Fail loudly at startup rather than at the first login attempt.
    throw new Error('JWT_SECRET is not set in .env');
}

/**
 * Sign a token for a user. Keep the payload small — it goes
 * on every request. Do NOT put secrets or passwords in here.
 */
export function signToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        SECRET,
        { expiresIn: EXPIRES_IN }
    );
}

/**
 * Verify a token. Throws if it's expired, tampered with,
 * or signed with a different secret.
 */
export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}