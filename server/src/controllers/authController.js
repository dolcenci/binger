// ---------------------------------------------------------
// Auth controller — register, login, me.
// ---------------------------------------------------------
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken } from '../config/jwt.js';

const BCRYPT_ROUNDS = 10;
const VALID_ROLES = ['artist', 'listener'];

/**
 * POST /api/auth/register
 * Body: { email, password, name, role?, address?, dateOfBirth?, bio? }
 * Returns: { ok, token, user }
 */
export async function register(req, res, next) {
    try {
        const {
            email,
            password,
            name,
            role = 'listener',
            address = null,
            dateOfBirth = null,
            bio = null,
        } = req.body || {};

        // --- validate ---
        if (!email || !password || !name) {
            return res.status(400).json({
                ok: false,
                error: 'email, password, and name are required',
            });
        }
        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({
                ok: false,
                error: `role must be one of: ${VALID_ROLES.join(', ')}`,
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                ok: false,
                error: 'password must be at least 6 characters',
            });
        }

        // --- is email already taken? ---
        const existing = await query('SELECT id FROM users WHERE email = $1', [
            email.toLowerCase(),
        ]);
        if (existing.rowCount > 0) {
            return res.status(409).json({
                ok: false,
                error: 'An account with that email already exists',
            });
        }

        // --- hash the password ---
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // --- insert ---
        const { rows } = await query(
            `INSERT INTO users (email, password_hash, name, role, address, date_of_birth, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, address, date_of_birth, bio,
                 profile_photo_url, total_earnings_milli, created_at`,
            [
                email.toLowerCase(),
                passwordHash,
                name,
                role,
                address,
                dateOfBirth,
                bio,
            ]
        );

        const user = rows[0];
        const token = signToken(user);

        res.status(201).json({ ok: true, token, user });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { ok, token, user }
 */
export async function login(req, res, next) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                error: 'email and password are required',
            });
        }

        const { rows } = await query(
            `SELECT id, email, password_hash, name, role,
              address, date_of_birth, bio, profile_photo_url,
              total_earnings_milli, created_at
       FROM users
       WHERE email = $1`,
            [email.toLowerCase()]
        );

        // Deliberately the same error whether the email doesn't exist
        // or the password is wrong — don't leak which one it was.
        const generic = { ok: false, error: 'Invalid email or password' };

        if (rows.length === 0) {
            return res.status(401).json(generic);
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json(generic);
        }

        delete user.password_hash;

        const token = signToken(user);
        res.json({ ok: true, token, user });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 * Returns: { ok, user }
 */
export async function me(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT id, email, name, role, address, date_of_birth, bio,
              profile_photo_url, total_earnings_milli, created_at
       FROM users
       WHERE id = $1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, error: 'User not found' });
        }

        res.json({ ok: true, user: rows[0] });
    } catch (err) {
        next(err);
    }
}