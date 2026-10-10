// ---------------------------------------------------------
// PostgreSQL connection pool.
// Uses DATABASE_URL from .env (Neon's pooled connection string).
// SSL is required by Neon.
// ---------------------------------------------------------
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
    console.error('[db] Unexpected error on idle client', err);
    process.exit(1);
});

export async function query(text, params) {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 200) {
        console.warn(`[db] slow query (${duration}ms):`, text);
    }
    return result;
}

export async function ping() {
    const { rows } = await pool.query('SELECT NOW() AS now');
    return rows[0].now;
}

export default pool;