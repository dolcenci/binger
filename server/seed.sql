INSERT INTO users (email, password_hash, name, role, address, date_of_birth, bio, total_earnings_milli)
VALUES
    ('artist1@binger.test',
     '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i8cLPvvPO7Lq5rC7Zqvq3oR5K7u3G',
     'Nova Ray', 'artist', '12 Long Street, Cape Town', '1995-04-12',
     'Synth-pop from the Cape Flats. Loud, bright, unapologetic.', 0),

    ('artist2@binger.test',
     '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i8cLPvvPO7Lq5rC7Zqvq3oR5K7u3G',
     'Kasi Collective', 'artist', '44 Vilakazi Street, Soweto', '1990-08-01',
     'Amapiano, gqom, and everything in between.', 0),

    ('listener1@binger.test',
     '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i8cLPvvPO7Lq5rC7Zqvq3oR5K7u3G',
     'Thandi Mokoena', 'listener', '9 Rissik Street, Johannesburg', '1999-11-22',
     'Here for the music.', 0);

INSERT INTO songs (user_id, title, artist_name, description, audio_url, cover_url, lyrics, plays, hearts)
VALUES
    (1, 'Midnight Drive', 'Nova Ray',
     'A slow-burning synth ballad about late-night highways.',
     '/uploads/audio/placeholder-1.mp3',
     '/uploads/covers/placeholder-1.jpg',
     'Verse 1: Streetlights streak across the glass...',
     128, 4),
    (1, 'Neon Sun', 'Nova Ray',
     'Uplifting, glittery, and slightly off-key on purpose.',
     '/uploads/audio/placeholder-2.mp3',
     '/uploads/covers/placeholder-2.jpg',
     '[Lyrics coming soon]',
     57, 2),
    (2, 'Soweto Nights', 'Kasi Collective',
     'Amapiano with a log-drum lead and a female vocal hook.',
     '/uploads/audio/placeholder-3.mp3',
     '/uploads/covers/placeholder-3.jpg',
     'Chorus: We move when the sun goes down...',
     302, 11);