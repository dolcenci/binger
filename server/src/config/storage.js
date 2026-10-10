// ---------------------------------------------------------
// Object storage wrapper.
// Uses Neon's S3-compatible storage via @aws-sdk/client-s3.
// ---------------------------------------------------------
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-2',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId:     process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    // Neon's storage (and most S3-compatible services) need this ON.
    forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET;
const PUBLIC_BASE = (process.env.S3_PUBLIC_URL_BASE || '').replace(/\/$/, '');

/**
 * Upload a local file (produced by multer) to the bucket.
 * Returns the public URL for the uploaded object.
 */
export async function uploadToBucket(localPath, kind, originalName) {
    const ext = path.extname(originalName).toLowerCase() || '';
    const rand = crypto.randomBytes(8).toString('hex');
    const key = `${kind}/${Date.now()}-${rand}${ext}`;

    const body = await fs.readFile(localPath);

    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
    }));

    // Clean up the local temp file.
    try { await fs.unlink(localPath); } catch { /* ignore */ }

    return `${PUBLIC_BASE}/${key}`;
}

/**
 * Delete an object given its public URL.
 */
export async function deleteFromBucket(publicUrl) {
    if (!publicUrl || typeof publicUrl !== 'string') return;
    if (!PUBLIC_BASE || !publicUrl.startsWith(PUBLIC_BASE + '/')) return;
    const key = publicUrl.slice(PUBLIC_BASE.length + 1);

    try {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (err) {
        console.warn('[storage] delete failed:', err.message);
    }
}

export { s3, BUCKET, PUBLIC_BASE };