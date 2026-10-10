// ---------------------------------------------------------
// Hearts controller — toggle + list.
// ---------------------------------------------------------
import { query } from '../config/db.js';

/** POST /api/hearts/:songId  — toggle heart for current user. */
export async function toggleHeart(req, res, next) {
    try {
        const songId = Number(req.params.songId);
        if (!Number.isInteger(songId)) {
            return res.status(400).json({ ok: false, error: 'Invalid song id' });
        }

        // Does the song exist?
        const songQ = await query(`SELECT id FROM songs WHERE id = $1`, [songId]);
        if (songQ.rowCount === 0) {
            return res.status(404).json({ ok: false, error: 'Song not found' });
        }

        // Is it already hearted by this user?
        const existing = await query(
            `SELECT id FROM hearts WHERE user_id = $1 AND song_id = $2`,
            [req.user.id, songId]
        );

        if (existing.rowCount > 0) {
            // Un-heart.
            await query(`DELETE FROM hearts WHERE id = $1`, [existing.rows[0].id]);
            await query(
                `UPDATE songs SET hearts = GREATEST(hearts - 1, 0) WHERE id = $1`,
                [songId]
            );
            return res.json({ ok: true, hearted: false });
        }

        // Heart.
        await query(
            `INSERT INTO hearts (user_id, song_id) VALUES ($1, $2)`,
            [req.user.id, songId]
        );
        await query(
            `UPDATE songs SET hearts = hearts + 1 WHERE id = $1`,
            [songId]
        );
        res.json({ ok: true, hearted: true });
    } catch (err) {
        next(err);
    }
}

/** GET /api/hearts/mine  — current user's hearted songs. */
export async function myHearts(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT s.id, s.title, s.artist_name, s.cover_url, s.audio_url,
              s.plays, s.hearts, s.user_id, h.created_at AS hearted_at
       FROM hearts h
       JOIN songs s ON s.id = h.song_id
       WHERE h.user_id = $1
       ORDER BY h.created_at DESC`,
            [req.user.id]
        );
        res.json({ ok: true, songs: rows });
    } catch (err) {
        next(err);
    }
}

/** GET /api/hearts/song/:songId  — is this song hearted by me? */
export async function isHearted(req, res, next) {
    try {
        const songId = Number(req.params.songId);
        if (!Number.isInteger(songId)) {
            return res.status(400).json({ ok: false, error: 'Invalid song id' });
        }
        const { rowCount } = await query(
            `SELECT 1 FROM hearts WHERE user_id = $1 AND song_id = $2`,
            [req.user.id, songId]
        );
        res.json({ ok: true, hearted: rowCount > 0 });
    } catch (err) {
        next(err);
    }
}