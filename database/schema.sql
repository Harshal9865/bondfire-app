-- ==============================================================================
-- BONDFIRE DATABASE SCHEMA (PostgreSQL 16+)
-- Bondfire 2.0: Private Interactive Entertainment Network
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'MEMBER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE pod_type AS ENUM ('SOLO', 'COUPLE', 'SQUAD', 'FAMILY', 'COLLEGE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE pod_role AS ENUM ('HOST', 'ADMIN', 'PLAYER', 'GUEST');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('PHOTO', 'CHAT_SCREENSHOT', 'VOICE_NOTE', 'TEXT_SNIPPET', 'REEL_VIDEO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    -- Updated game modes for 2.0
    CREATE TYPE game_mode AS ENUM ('OUR_LORE', 'WHO_SAID_THIS', 'MOST_LIKELY_TO', 'CAPTION_BATTLE', 'GUESS_THE_MEMORY', 'TRUTH_OR_BLUFF', 'EMOJI_CINEMA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE game_status AS ENUM ('LOBBY', 'WARMUP', 'IN_PROGRESS', 'ROUND_REVEAL', 'REACTION', 'MEMORY_MOMENT', 'COMPLETED', 'ABANDONED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'PRINTING', 'SHIPPED', 'DELIVERED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

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

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    display_name VARCHAR(80) NOT NULL,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTH IDENTITIES
CREATE TABLE IF NOT EXISTS auth_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_provider_user UNIQUE(provider, provider_user_id)
);

-- 4.5. GROUPS (New in 2.0 for recurring social memory)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    group_type pod_type NOT NULL DEFAULT 'SQUAD',
    inside_jokes JSONB DEFAULT '[]'::jsonb,
    favorite_languages JSONB DEFAULT '["en"]'::jsonb,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PODS (The Multi-Tenant Workspace / Active Session for a Group)
CREATE TABLE IF NOT EXISTS pods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type pod_type NOT NULL DEFAULT 'SQUAD',
    room_code VARCHAR(8) UNIQUE NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMPTZ,
    encryption_key_id VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POD MEMBERSHIPS (RBAC & Scores)
CREATE TABLE IF NOT EXISTS pod_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role pod_role NOT NULL DEFAULT 'PLAYER',
    score_all_time INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_pod_user UNIQUE(pod_id, user_id)
);

-- 7. MEMORIES (The Core Vault & Graph)
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE, -- Tied to group in 2.0
    pod_id UUID REFERENCES pods(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255),
    raw_text TEXT,
    ocr_extracted_text TEXT,
    event_timestamp TIMESTAMPTZ,
    is_playable BOOLEAN DEFAULT TRUE,
    is_private_to_owner BOOLEAN DEFAULT FALSE,
    structured_data JSONB, -- For the memory graph (people, places, tags)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEMORY MEDIA FILES
CREATE TABLE IF NOT EXISTS memory_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    storage_key TEXT NOT NULL,
    blur_hash VARCHAR(100),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    waveform_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GAME SESSIONS
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    host_user_id UUID NOT NULL REFERENCES users(id),
    mode game_mode NOT NULL,
    status game_status NOT NULL DEFAULT 'LOBBY',
    total_rounds INT NOT NULL DEFAULT 7,
    current_round_index INT DEFAULT 0,
    mood_setting VARCHAR(50) DEFAULT 'CHAOTIC', -- 2.0 setting
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GAME ROUNDS
CREATE TABLE IF NOT EXISTS game_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
    round_number INT NOT NULL,
    question_prompt TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options JSONB NOT NULL,
    time_limit_seconds INT DEFAULT 20,
    started_at TIMESTAMPTZ,
    revealed_at TIMESTAMPTZ,
    CONSTRAINT uq_session_round UNIQUE(game_session_id, round_number)
);

-- 11. PLAYER VOTES
CREATE TABLE IF NOT EXISTS player_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_round_id UUID NOT NULL REFERENCES game_rounds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    selected_option TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_awarded INT DEFAULT 0,
    response_time_ms INT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_round_player UNIQUE(game_round_id, user_id)
);

-- 12. YEARBOOKS & ALBUMS (Physical Keepsakes)
CREATE TABLE IF NOT EXISTS yearbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    season_name VARCHAR(100) NOT NULL,
    cover_material VARCHAR(50) DEFAULT 'MATTE_HARDCOVER',
    total_pages INT DEFAULT 48,
    pdf_render_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. YEARBOOK PAGES
CREATE TABLE IF NOT EXISTS yearbook_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    yearbook_id UUID NOT NULL REFERENCES yearbooks(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    content_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_yearbook_page UNIQUE(yearbook_id, page_number)
);

-- 14. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    pod_id UUID REFERENCES pods(id),
    yearbook_id UUID REFERENCES yearbooks(id),
    stripe_session_id VARCHAR(255) UNIQUE,
    status order_status DEFAULT 'PENDING',
    quantity INT NOT NULL DEFAULT 1,
    amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSONB NOT NULL,
    tracking_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. THE BONDFIRE MEMORY GRAPH (Structured, User-Controlled Memory Nodes)
CREATE TABLE IF NOT EXISTS memory_graph_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 16. ROOM SESSIONS (Room OS Show Runner Engine)
CREATE TABLE IF NOT EXISTS room_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 17. HUMOR CONSENT & PANIC FLAGS
CREATE TABLE IF NOT EXISTS player_humor_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_session_id UUID NOT NULL REFERENCES room_sessions(id) ON DELETE CASCADE,
    player_user_id UUID NOT NULL REFERENCES users(id),
    flag_type VARCHAR(50) NOT NULL, -- 'TOO_PERSONAL', 'NOT_FUNNY', 'REMOVE_PROMPT', 'REPORT'
    prompt_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. WATCH-AND-PLAY CARDS
CREATE TABLE IF NOT EXISTS watch_play_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 19. RECURRING GROUP MISSIONS
CREATE TABLE IF NOT EXISTS group_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    prompt_title VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) NOT NULL,
    submitted_payload JSONB DEFAULT '{}'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES & TRIGGERS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pods_room_code ON pods(room_code);
CREATE INDEX IF NOT EXISTS idx_pod_memberships_pod_user ON pod_memberships(pod_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memories_group_playable ON memories(group_id, is_playable);
CREATE INDEX IF NOT EXISTS idx_game_sessions_pod ON game_sessions(pod_id, status);
CREATE INDEX IF NOT EXISTS idx_game_rounds_session ON game_rounds(game_session_id);
CREATE INDEX IF NOT EXISTS idx_player_votes_round ON player_votes(game_round_id);
CREATE INDEX IF NOT EXISTS idx_memories_ocr_search ON memories USING gin(to_tsvector('english', COALESCE(ocr_extracted_text, '')));
CREATE INDEX IF NOT EXISTS idx_memory_graph_group_status ON memory_graph_nodes(group_id, status);
CREATE INDEX IF NOT EXISTS idx_room_sessions_code ON room_sessions(room_code);

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pods_modtime BEFORE UPDATE ON pods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_modtime BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
