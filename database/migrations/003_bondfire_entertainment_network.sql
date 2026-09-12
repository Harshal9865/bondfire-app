-- ==============================================================================
-- MIGRATION 003: BONDFIRE 2.0 ENTERTAINMENT NETWORK & MEMORY GRAPH
-- Dedicated Supabase / PostgreSQL 16+ Migration
-- Supports: Room OS templates, Memory Graph nodes, Consent Humor Flags,
--           Watch-and-Play Interactive Cards, and Recurring Group Missions
-- ==============================================================================

-- 1. ENUMS FOR ROOM OS, HUMOR CONSENT & WATCH-AND-PLAY
DO $$ BEGIN
    CREATE TYPE room_template_type AS ENUM (
        'SQUAD_NIGHT', 'COUPLE_DATE', 'FAMILY_ADDA', 'COLLEGE_HOSTEL', 
        'WEDDING_HOUSE', 'CREATOR_LIVE', 'WATCH_PARTY', 'CRICKET_PREDICTION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE humor_tone AS ENUM (
        'FAMILY_SAFE', 'LIGHT_TEASING', 'FRIENDLY_ROAST', 'SAVAGE_ROAST', 'ROMANTIC', 'EMOTIONAL'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE watch_play_card_type AS ENUM (
        'GUESS_THE_ENDING', 'CHOOSE_NEXT_SCENE', 'COMPLETE_THE_LYRIC', 
        'REEL_COURT', 'PREDICT_WINNER', 'CAPTION_THIS', 'SPOT_HIDDEN'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. ENHANCE GROUPS TABLE (The Core Social Unit)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    group_type VARCHAR(50) NOT NULL DEFAULT 'SQUAD',
    inside_jokes JSONB DEFAULT '[]'::jsonb,
    recurring_rivalries JSONB DEFAULT '[]'::jsonb,
    level INT DEFAULT 1,
    sparks_pool INT DEFAULT 100,
    win_streaks JSONB DEFAULT '{}'::jsonb,
    favorite_languages JSONB DEFAULT '["en", "hi-IN"]'::jsonb,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. THE BONDFIRE MEMORY GRAPH (Structured, User-Controlled Memory Nodes)
CREATE TABLE IF NOT EXISTS memory_graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'PEOPLE', 'PLACES', 'EVENTS', 'QUOTES', 'RUNNING_JOKES', 'FOOD', 'SONGS'
    title VARCHAR(255) NOT NULL,
    context_snippet TEXT,
    media_url TEXT,
    event_date DATE,
    sentiment_tag VARCHAR(50) DEFAULT 'NOSTALGIC',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'APPROVED', 'PENDING_APPROVAL', 'IGNORED', 'DELETED'
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memory_graph_group_status ON memory_graph_nodes(group_id, status);
CREATE INDEX IF NOT EXISTS idx_memory_graph_category ON memory_graph_nodes(category);

-- 4. ROOM SESSIONS (Room OS)
CREATE TABLE IF NOT EXISTS room_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    room_code VARCHAR(8) UNIQUE NOT NULL,
    template_type room_template_type NOT NULL DEFAULT 'SQUAD_NIGHT',
    host_user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'LOBBY', -- 'LOBBY', 'WARMUP', 'GAME_ROUND', 'REACTION', 'MEMORY_MOMENT', 'COMPLETED'
    humor_tone humor_tone NOT NULL DEFAULT 'FRIENDLY_ROAST',
    selected_language VARCHAR(20) NOT NULL DEFAULT 'hi-IN',
    duration_minutes INT NOT NULL DEFAULT 20,
    player_count INT DEFAULT 1,
    current_step_index INT DEFAULT 0,
    total_steps INT DEFAULT 7,
    session_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_room_sessions_code ON room_sessions(room_code);

-- 5. HUMOR CONSENT & SAFETY TRIGGERS (Zero-Tolerance Harassment Protection)
CREATE TABLE IF NOT EXISTS player_humor_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_session_id UUID NOT NULL REFERENCES room_sessions(id) ON DELETE CASCADE,
    player_user_id UUID NOT NULL REFERENCES users(id),
    flag_type VARCHAR(50) NOT NULL, -- 'TOO_PERSONAL', 'NOT_FUNNY', 'REMOVE_PROMPT', 'REPORT'
    prompt_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WATCH-AND-PLAY CARDS (Interactive Short Video / Audio Episodes)
CREATE TABLE IF NOT EXISTS watch_play_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    card_type watch_play_card_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    pause_timestamp_seconds NUMERIC(5,2) NOT NULL,
    prompt_question TEXT NOT NULL,
    options JSONB NOT NULL,
    reveal_explanation TEXT,
    language VARCHAR(20) DEFAULT 'hi-IN',
    tags JSONB DEFAULT '[]'::jsonb,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RECURRING GROUP MISSIONS
CREATE TABLE IF NOT EXISTS group_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    prompt_title VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) NOT NULL, -- 'PHOTO', 'VOICE_NOTE', 'ONE_LINER', 'EMOJI'
    submitted_payload JSONB DEFAULT '{}'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
