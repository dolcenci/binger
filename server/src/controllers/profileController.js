// ---------------------------------------------------------
// Profile controller — get, update, change photo.
// ---------------------------------------------------------
import { query } from '../config/db.js';

/** GET /api/profile/me */
export async function getProfile(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT id, email, name, role, address, date_of_birth, bio,
              profile_photo_url, total_earnings_milli, created_at
       FROM users
       WHERE id = $1`,
            [req.user.id]
        );
        res.json({ ok: true, user: rows[0] });
    } catch (err) {
        next(err);
    }
}

/** PUT /api/profile/me */
export async function updateProfile(req, res, next) {
    try {
        const { name, address, dateOfBirth, bio } = req.body || {};

        const updates = {};
        if (name?.trim())          updates.name = name.trim();
        if ('address' in req.body) updates.address = req.body.address?.trim() || null;
        if ('dateOfBirth' in req.body) updates.date_of_birth = req.body.dateOfBirth || null;
        if ('bio' in req.body)     updates.bio = req.body.bio?.trim() || null;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ ok: false, error: 'No fields to update' });
        }

        const setParts = [];
        const values = [];
        let i = 1;
        for (const [col, val] of Object.entries(updates)) {
            setParts.push(`${col} = $${i++}`);
            values.push(val);
        }
        values.push(req.user.id);

        const { rows } = await query(
            `UPDATE users SET ${setParts.join(', ')}
       WHERE id = $${i}
       RETURNING id, email, name, role, address, date_of_birth, bio,
                 profile_photo_url, total_earnings_milli, created_at`,
            values
        );

        res.json({ ok: true, user: rows[0] });
    } catch (err) {
        next(err);
    }
}

/** POST /api/profile/photo  (multipart field: `photo`) */
export async function updateProfilePhoto(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, error: 'No photo uploaded' });
        }
        const url = `/uploads/profiles/${req.file.filename}`;
        const { rows } = await query(
            `UPDATE users SET profile_photo_url = $1
       WHERE id = $2
       RETURNING id, profile_photo_url`,
            [url, req.user.id]
        );
        res.json({ ok: true, user: rows[0] });
    } catch (err) {
        next(err);
    }
}