DROP TABLE IF EXISTS payouts           CASCADE;
DROP TABLE IF EXISTS earnings_ledger   CASCADE;
DROP TABLE IF EXISTS banking_details   CASCADE;
DROP TABLE IF EXISTS hearts            CASCADE;
DROP TABLE IF EXISTS plays             CASCADE;
DROP TABLE IF EXISTS songs             CASCADE;
DROP TABLE IF EXISTS users             CASCADE;

DROP TYPE  IF EXISTS user_role;
DROP TYPE  IF EXISTS payout_status;

CREATE TYPE user_role     AS ENUM ('artist', 'listener');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');

CREATE TABLE users (
                       id                     SERIAL       PRIMARY KEY,
                       email                  VARCHAR(255) NOT NULL UNIQUE,
                       password_hash          VARCHAR(255) NOT NULL,
                       name                   VARCHAR(120) NOT NULL,
                       role                   user_role    NOT NULL DEFAULT 'listener',
                       address                TEXT,
                       date_of_birth          DATE,
                       bio                    TEXT,
                       profile_photo_url      TEXT,
                       total_earnings_milli   BIGINT       NOT NULL DEFAULT 0,
                       created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       updated_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_role  ON users(role);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE songs (
                       id              SERIAL       PRIMARY KEY,
                       user_id         INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       title           VARCHAR(200) NOT NULL,
                       artist_name     VARCHAR(200) NOT NULL,
                       description     TEXT,
                       audio_url       TEXT         NOT NULL,
                       cover_url       TEXT,
                       lyrics          TEXT,
                       plays           INTEGER      NOT NULL DEFAULT 0,
                       hearts          INTEGER      NOT NULL DEFAULT 0,
                       created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_songs_user_id    ON songs(user_id);
CREATE INDEX idx_songs_plays_desc ON songs(plays DESC);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);

CREATE TABLE plays (
                       id          SERIAL       PRIMARY KEY,
                       user_id     INTEGER      REFERENCES users(id) ON DELETE SET NULL,
                       song_id     INTEGER      NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
                       played_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                       seconds     INTEGER      NOT NULL DEFAULT 0,
                       counted     BOOLEAN      NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_plays_song_id   ON plays(song_id);
CREATE INDEX idx_plays_user_song ON plays(user_id, song_id, played_at DESC);

CREATE TABLE hearts (
                        id          SERIAL       PRIMARY KEY,
                        user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        song_id     INTEGER      NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
                        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                        UNIQUE (user_id, song_id)
);
CREATE INDEX idx_hearts_song_id ON hearts(song_id);

CREATE TABLE banking_details (
                                 id              SERIAL       PRIMARY KEY,
                                 artist_id       INTEGER      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                                 bank_name       VARCHAR(120) NOT NULL,
                                 account_number  VARCHAR(60)  NOT NULL,
                                 branch_code     VARCHAR(30)  NOT NULL,
                                 account_type    VARCHAR(40)  NOT NULL,
                                 created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                                 updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE earnings_ledger (
                                 id                   BIGSERIAL    PRIMARY KEY,
                                 artist_id            INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                 song_id              INTEGER      NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
                                 play_id              INTEGER      REFERENCES plays(id) ON DELETE SET NULL,
                                 amount_milli         BIGINT       NOT NULL,
                                 reason               VARCHAR(60)  NOT NULL DEFAULT 'play',
                                 created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ledger_artist_id ON earnings_ledger(artist_id);
CREATE INDEX idx_ledger_song_id   ON earnings_ledger(song_id);
CREATE INDEX idx_ledger_created   ON earnings_ledger(created_at DESC);

CREATE TABLE payouts (
                         id                   SERIAL         PRIMARY KEY,
                         artist_id            INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         amount_milli         BIGINT         NOT NULL,
                         status               payout_status  NOT NULL DEFAULT 'pending',
                         reference            VARCHAR(120),
                         note                 TEXT,
                         created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
                         paid_at              TIMESTAMPTZ
);
CREATE INDEX idx_payouts_artist_id ON payouts(artist_id);
CREATE INDEX idx_payouts_status    ON payouts(status);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_banking_updated_at
    BEFORE UPDATE ON banking_details
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();