// ---------------------------------------------------------
// Multer configuration.
// Files land in server/tmp/ first. Controllers then upload
// them to Neon Object Storage and delete the local copy.
// ---------------------------------------------------------
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const TMP_ROOT = path.join(__dirname, '..', '..', 'tmp');
fs.mkdirSync(TMP_ROOT, { recursive: true });

const AUDIO_MIMES = new Set([
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
    'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'audio/flac',
    'audio/x-flac', 'audio/aac',
]);

const IMAGE_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
]);

function uniqueName(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    const stamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 10);
    return `${stamp}-${rand}${ext}`;
}

export const uploadSong = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, TMP_ROOT),
        filename:    (_req, file, cb) => cb(null, uniqueName(file)),
    }),
    limits: { fileSize: 50 * 1024 * 1024, files: 3 },
    fileFilter: (_req, file, cb) => {
        if (file.fieldname === 'audio') {
            if (!AUDIO_MIMES.has(file.mimetype)) return cb(new Error(`Unsupported audio type: ${file.mimetype}`));
            return cb(null, true);
        }
        if (file.fieldname === 'cover') {
            if (!IMAGE_MIMES.has(file.mimetype)) return cb(new Error(`Unsupported image type: ${file.mimetype}`));
            return cb(null, true);
        }
        if (file.fieldname === 'lyricsFile') {
            const isTxt = file.originalname.toLowerCase().endsWith('.txt');
            if (!isTxt && file.mimetype !== 'text/plain') return cb(new Error(`Unsupported lyrics type: ${file.mimetype}`));
            return cb(null, true);
        }
        cb(new Error(`Unexpected field: ${file.fieldname}`));
    },
}).fields([
    { name: 'audio',      maxCount: 1 },
    { name: 'cover',      maxCount: 1 },
    { name: 'lyricsFile', maxCount: 1 },
]);

export const uploadProfilePhoto = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, TMP_ROOT),
        filename:    (_req, file, cb) => cb(null, uniqueName(file)),
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (!IMAGE_MIMES.has(file.mimetype)) return cb(new Error(`Unsupported image type: ${file.mimetype}`));
        cb(null, true);
    },
}).single('photo');