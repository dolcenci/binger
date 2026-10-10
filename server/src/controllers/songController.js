// ---------------------------------------------------------
// Songs controller — list, upload, edit, delete, plays.
// Files are uploaded to Neon Object Storage.
// ---------------------------------------------------------
import fs from 'node:fs/promises';
import { query, default as pool } from '../config/db.js';
import { uploadToBucket, deleteFromBucket } from '../config/storage.js';

const EARNINGS_PER_PLAY_MILLI = 5;   // R0.005
const PLAY_THRESHOLD_SECONDS = 30;
const PLAY_DEDUP_MINUTES = 30;

async function cleanupLocal(files) {
    if (!files) return;
    for (const key of Object.keys(files)) {
        for (const f of files[key] || []) {
            try { await fs.unlink(f.path); } catch { /* ignore */ }
        }
    }
}

// --- public list endpoints ----------------------------------

export async function listSongs(_req, res, next) {
    try {
        const { rows } = await query(
            `SELECT s.id, s.title, s.artist_name, s.description,
              s.audio_url, s.cover_url, s.plays, s.hearts,
              s.created_at, s.user_id,
              u.name AS uploader_name
       FROM songs s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC`
        );
        res.json({ ok: true, songs: rows });
    } catch (err) { next(err); }
}

export async function topSongs(req, res, next) {
    try {
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const { rows } = await query(
            `SELECT s.id, s.title, s.artist_name, s.audio_url, s.cover_url,
              s.plays, s.hearts, s.user_id
       FROM songs s
       ORDER BY s.plays DESC, s.created_at DESC
       LIMIT $1`,
            [limit]
        );
        res.json({ ok: true, songs: rows });
    } catch (err) { next(err); }
}

export async function listArtists(_req, res, next) {
    try {
        const { rows } = await query(
            `SELECT u.id AS user_id,
              u.name AS artist_name,
              COUNT(s.id) AS song_count,
              COALESCE(SUM(s.plays), 0) AS total_plays
       FROM users u
       JOIN songs s ON s.user_id = u.id
       GROUP BY u.id, u.name
       ORDER BY total_plays DESC, u.name ASC`
        );
        res.json({ ok: true, artists: rows });
    } catch (err) { next(err); }
}

export async function songsByArtist(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId)) return res.status(400).json({ ok: false, error: 'Invalid artist id' });
        const { rows } = await query(
            `SELECT id, title, artist_name, description, audio_url,
              cover_url, plays, hearts, created_at, user_id
       FROM songs
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [userId]
        );
        res.json({ ok: true, songs: rows });
    } catch (err) { next(err); }
}

export async function getSong(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ ok: false, error: 'Invalid song id' });
        const { rows } = await query(
            `SELECT s.id, s.title, s.artist_name, s.description,
              s.audio_url, s.cover_url, s.lyrics, s.plays, s.hearts,
              s.created_at, s.user_id,
              u.name AS uploader_name
       FROM songs s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = $1`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Song not found' });
        res.json({ ok: true, song: rows[0] });
    } catch (err) { next(err); }
}

// --- upload (artist only) ----------------------------------

export async function uploadSongHandler(req, res, next) {
    try {
        const { title, artistName, description = '', lyrics = '' } = req.body || {};
        const files = req.files || {};

        if (!title || !artistName) {
            await cleanupLocal(files);
            return res.status(400).json({ ok: false, error: 'title and artistName are required' });
        }
        if (!files.audio?.[0] || !files.cover?.[0]) {
            await cleanupLocal(files);
            return res.status(400).json({ ok: false, error: 'audio and cover files are required' });
        }

        const audioUrl = await uploadToBucket(files.audio[0].path, 'audio', files.audio[0].originalname);
        const coverUrl = await uploadToBucket(files.cover[0].path, 'covers', files.cover[0].originalname);

        let lyricsValue = lyrics?.trim() || null;
        if (files.lyricsFile?.[0]) {
            lyricsValue = await uploadToBucket(files.lyricsFile[0].path, 'lyrics', files.lyricsFile[0].originalname);
        }

        const { rows } = await query(
            `INSERT INTO songs
         (user_id, title, artist_name, description, audio_url, cover_url, lyrics)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, artist_name, description, audio_url,
                 cover_url, lyrics, plays, hearts, created_at, user_id`,
            [req.user.id, title.trim(), artistName.trim(), description.trim() || null,
                audioUrl, coverUrl, lyricsValue]
        );

        res.status(201).json({ ok: true, song: rows[0] });
    } catch (err) { next(err); }
}

// --- edit (artist only, own songs) -------------------------

export async function updateSong(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ ok: false, error: 'Invalid song id' });

        const { rows } = await query(
            `SELECT id, user_id, audio_url, cover_url FROM songs WHERE id = $1`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Song not found' });
        const song = rows[0];
        if (song.user_id !== req.user.id) {
            return res.status(403).json({ ok: false, error: 'You can only edit your own songs' });
        }

        const files = req.files || {};
        const updates = {};

        if (req.body.title?.trim())      updates.title = req.body.title.trim();
        if (req.body.artistName?.trim()) updates.artist_name = req.body.artistName.trim();
        if ('description' in req.body)   updates.description = req.body.description?.trim() || null;
        if ('lyrics' in req.body)        updates.lyrics = req.body.lyrics?.trim() || null;

        if (files.audio?.[0]) {
            updates.audio_url = await uploadToBucket(files.audio[0].path, 'audio', files.audio[0].originalname);
        }
        if (files.cover?.[0]) {
            updates.cover_url = await uploadToBucket(files.cover[0].path, 'covers', files.cover[0].originalname);
        }
        if (files.lyricsFile?.[0]) {
            updates.lyrics = await uploadToBucket(files.lyricsFile[0].path, 'lyrics', files.lyricsFile[0].originalname);
        }

        if (Object.keys(updates).length === 0) {
            await cleanupLocal(files);
            return res.status(400).json({ ok: false, error: 'No fields to update' });
        }

        const setParts = [];
        const values = [];
        let i = 1;
        for (const [col, val] of Object.entries(updates)) {
            setParts.push(`${col} = $${i++}`);
            values.push(val);
        }
        values.push(id);

        const result = await query(
            `UPDATE songs SET ${setParts.join(', ')}
       WHERE id = $${i}
       RETURNING id, title, artist_name, description, audio_url,
                 cover_url, lyrics, plays, hearts, created_at, user_id`,
            values
        );

        if (updates.audio_url && song.audio_url) await deleteFromBucket(song.audio_url);
        if (updates.cover_url && song.cover_url) await deleteFromBucket(song.cover_url);

        res.json({ ok: true, song: result.rows[0] });
    } catch (err) { next(err); }
}

export async function deleteSong(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ ok: false, error: 'Invalid song id' });

        const { rows } = await query(
            `SELECT id, user_id, audio_url, cover_url FROM songs WHERE id = $1`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Song not found' });
        const song = rows[0];
        if (song.user_id !== req.user.id) {
            return res.status(403).json({ ok: false, error: 'You can only delete your own songs' });
        }

        await query(`DELETE FROM songs WHERE id = $1`, [id]);
        await deleteFromBucket(song.audio_url);
        await deleteFromBucket(song.cover_url);

        res.json({ ok: true, deleted: id });
    } catch (err) { next(err); }
}

// --- play counting ----------------------------------------

export async function recordPlay(req, res, next) {
    const songId = Number(req.params.id);
    if (!Number.isInteger(songId)) return res.status(400).json({ ok: false, error: 'Invalid song id' });

    const seconds = Math.max(0, Math.floor(Number(req.body?.seconds) || 0));
    const userId = req.user?.id || null;

    let client;
    try {
        const songQ = await query(`SELECT id, user_id, plays FROM songs WHERE id = $1`, [songId]);
        if (songQ.rows.length === 0) return res.status(404).json({ ok: false, error: 'Song not found' });
        const song = songQ.rows[0];

        if (!userId) {
            await query(
                `INSERT INTO plays (user_id, song_id, seconds, counted) VALUES (NULL, $1, $2, FALSE)`,
                [songId, seconds]
            );
            return res.json({ ok: true, counted: false, reason: 'not_authenticated' });
        }
        if (seconds < PLAY_THRESHOLD_SECONDS) {
            await query(
                `INSERT INTO plays (user_id, song_id, seconds, counted) VALUES ($1, $2, $3, FALSE)`,
                [userId, songId, seconds]
            );
            return res.json({ ok: true, counted: false, reason: 'below_threshold' });
        }

        const dedupQ = await query(
            `SELECT 1 FROM plays
       WHERE user_id = $1 AND song_id = $2 AND counted = TRUE
         AND played_at > NOW() - ($3 || ' minutes')::interval
       LIMIT 1`,
            [userId, songId, String(PLAY_DEDUP_MINUTES)]
        );
        if (dedupQ.rowCount > 0) {
            return res.json({ ok: true, counted: false, reason: 'duplicate' });
        }

        client = await pool.connect();
        await client.query('BEGIN');

        const playIns = await client.query(
            `INSERT INTO plays (user_id, song_id, seconds, counted)
       VALUES ($1, $2, $3, TRUE) RETURNING id`,
            [userId, songId, seconds]
        );
        const playId = playIns.rows[0].id;

        await client.query(`UPDATE songs SET plays = plays + 1 WHERE id = $1`, [songId]);
        await client.query(
            `INSERT INTO earnings_ledger (artist_id, song_id, play_id, amount_milli, reason)
       VALUES ($1, $2, $3, $4, 'play')`,
            [song.user_id, songId, playId, EARNINGS_PER_PLAY_MILLI]
        );
        await client.query(
            `UPDATE users SET total_earnings_milli = total_earnings_milli + $1 WHERE id = $2`,
            [EARNINGS_PER_PLAY_MILLI, song.user_id]
        );

        await client.query('COMMIT');
        res.json({ ok: true, counted: true, amountMilli: EARNINGS_PER_PLAY_MILLI });
    } catch (err) {
        if (client) { try { await client.query('ROLLBACK'); } catch { /* ignore */ } }
        next(err);
    } finally {
        if (client) client.release();
    }
}

export async function myEarnings(req, res, next) {
    try {
        const perSong = await query(
            `SELECT s.id, s.title, s.plays,
              COALESCE(SUM(el.amount_milli), 0) AS earnings_milli
       FROM songs s
       LEFT JOIN earnings_ledger el ON el.song_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id, s.title, s.plays
       ORDER BY earnings_milli DESC, s.title ASC`,
            [req.user.id]
        );
        const totalQ = await query(`SELECT total_earnings_milli FROM users WHERE id = $1`, [req.user.id]);
        const totalMilli = totalQ.rows[0]?.total_earnings_milli || 0;

        res.json({
            ok: true,
            totalMilli,
            totalRands: (totalMilli / 1000).toFixed(3),
            songs: perSong.rows.map(r => ({
                ...r,
                earnings_rands: (Number(r.earnings_milli) / 1000).toFixed(3),
            })),
        });
    } catch (err) { next(err); }
}

export async function mySongs(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT id, title, artist_name, description, audio_url,
              cover_url, lyrics, plays, hearts, created_at, user_id
       FROM songs
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json({ ok: true, songs: rows });
    } catch (err) { next(err); }
}