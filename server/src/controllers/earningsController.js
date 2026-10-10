// ---------------------------------------------------------
// Earnings controller — banking details + claim.
// ---------------------------------------------------------

import { query, default as pool } from '../config/db.js';

// Minimum balance to claim, in milli-rands.
// R100.00 = 100_000 milli-rands.
const MIN_CLAIM_MILLI = 100_000;

// ---------------------------------------------------------
// Banking details
// ---------------------------------------------------------

/** GET /api/earnings/banking */
export async function getBanking(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT id, bank_name, account_number, branch_code, account_type,
              created_at, updated_at
       FROM banking_details
       WHERE artist_id = $1`,
            [req.user.id]
        );
        res.json({ ok: true, banking: rows[0] || null });
    } catch (err) {
        next(err);
    }
}

/** PUT /api/earnings/banking */
export async function saveBanking(req, res, next) {
    try {
        const { bankName, accountNumber, branchCode, accountType } = req.body || {};

        if (!bankName || !accountNumber || !branchCode || !accountType) {
            return res.status(400).json({
                ok: false,
                error: 'bankName, accountNumber, branchCode, and accountType are required',
            });
        }

        // Upsert — insert or update on conflict of artist_id.
        const { rows } = await query(
            `INSERT INTO banking_details
         (artist_id, bank_name, account_number, branch_code, account_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (artist_id) DO UPDATE SET
         bank_name      = EXCLUDED.bank_name,
         account_number = EXCLUDED.account_number,
         branch_code    = EXCLUDED.branch_code,
         account_type   = EXCLUDED.account_type,
         updated_at     = NOW()
       RETURNING id, bank_name, account_number, branch_code,
                 account_type, created_at, updated_at`,
            [req.user.id, bankName, accountNumber, branchCode, accountType]
        );

        res.json({ ok: true, banking: rows[0] });
    } catch (err) {
        next(err);
    }
}

// ---------------------------------------------------------
// Claim
// ---------------------------------------------------------

/**
 * POST /api/earnings/claim
 * Body: { agreedToTerms: true }
 *
 * Rules:
 *  - Must be an artist.
 *  - Must have banking details saved.
 *  - Must have agreedToTerms.
 *  - Must have at least MIN_CLAIM_MILLI.
 *
 * On success:
 *  - Create a `payouts` row with status='pending', amount = current balance.
 *  - Zero out users.total_earnings_milli (or, better, subtract amount).
 */
export async function claimEarnings(req, res, next) {
    const { agreedToTerms } = req.body || {};

    if (!agreedToTerms) {
        return res.status(400).json({
            ok: false,
            error: 'You must agree to the earnings disclaimer',
        });
    }

    let client;
    try {
        // Banking details saved?
        const bankQ = await query(
            `SELECT id FROM banking_details WHERE artist_id = $1`,
            [req.user.id]
        );
        if (bankQ.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                error: 'Please add your banking details before claiming earnings',
            });
        }

        // Check balance.
        const balQ = await query(
            `SELECT total_earnings_milli FROM users WHERE id = $1`,
            [req.user.id]
        );
        const balance = Number(balQ.rows[0]?.total_earnings_milli || 0);

        if (balance < MIN_CLAIM_MILLI) {
            return res.status(400).json({
                ok: false,
                error: `Minimum claim is R${(MIN_CLAIM_MILLI / 1000).toFixed(2)}. ` +
                    `Your current balance is R${(balance / 1000).toFixed(2)}.`,
                balanceMilli: balance,
                minMilli: MIN_CLAIM_MILLI,
            });
        }

        // Transaction: create payout, zero the cached balance.
        client = await pool.connect();
        await client.query('BEGIN');

        const payoutIns = await client.query(
            `INSERT INTO payouts (artist_id, amount_milli, status, note)
       VALUES ($1, $2, 'pending', 'Claimed via artist dashboard')
       RETURNING id, artist_id, amount_milli, status, created_at`,
            [req.user.id, balance]
        );

        await client.query(
            `UPDATE users SET total_earnings_milli = 0 WHERE id = $1`,
            [req.user.id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            ok: true,
            payout: payoutIns.rows[0],
            amountRands: (balance / 1000).toFixed(3),
        });
    } catch (err) {
        if (client) {
            try { await client.query('ROLLBACK'); } catch { /* ignore */ }
        }
        next(err);
    } finally {
        if (client) client.release();
    }
}

/** GET /api/earnings/payouts  — history of claims. */
export async function listPayouts(req, res, next) {
    try {
        const { rows } = await query(
            `SELECT id, amount_milli, status, reference, note,
              created_at, paid_at
       FROM payouts
       WHERE artist_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json({
            ok: true,
            payouts: rows.map(r => ({
                ...r,
                amount_rands: (Number(r.amount_milli) / 1000).toFixed(3),
            })),
        });
    } catch (err) {
        next(err);
    }
}