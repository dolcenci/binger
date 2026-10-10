// ---------------------------------------------------------
// Binger API — entry point.
// ---------------------------------------------------------
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { query } from './config/db.js';
import healthRouter   from './routes/health.js';
import authRouter     from './routes/auth.js';
import songsRouter    from './routes/songs.js';
import heartsRouter   from './routes/hearts.js';
import earningsRouter from './routes/earnings.js';
import profileRouter  from './routes/profile.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
    res.json({ ok: true, service: 'binger-api', docs: '/api/health' });
});

app.use('/api/health',   healthRouter);
app.use('/api/auth',     authRouter);
app.use('/api/songs',    songsRouter);
app.use('/api/hearts',   heartsRouter);
app.use('/api/earnings', earningsRouter);
app.use('/api/profile',  profileRouter);

app.use(notFound);
app.use(errorHandler);

async function boot() {
    try {
        const { rows } = await query('SELECT NOW() AS now');
        console.log(`[db] connected at ${rows[0].now.toISOString()}`);
        app.listen(PORT, () => {
            console.log(`[api] Binger API listening on http://localhost:${PORT}`);
            console.log(`[api] env=${process.env.NODE_ENV || 'development'}`);
        });
    } catch (err) {
        console.error('[boot] Failed to start:', err.message);
        process.exit(1);
    }
}

boot();