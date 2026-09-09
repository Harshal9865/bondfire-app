-- ==============================================================================
-- BONDFIRE DATABASE SCHEMA (PostgreSQL 16+)
-- Multi-Tenant Architecture for Social Memory Gaming, Keepsakes, and Pods
-- Version: 1.0.0 (Production Release)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pod_type AS ENUM ('SOLO', 'COUPLE', 'SQUAD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pod_role AS ENUM ('HOST', 'ADMIN', 'PLAYER', 'GUEST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('PHOTO', 'CHAT_SCREENSHOT', 'VOICE_NOTE', 'TEXT_SNIPPET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE game_mode AS ENUM ('WHO_SAID_THIS', 'THEN_VS_NOW', 'MOST_LIKELY_TO', 'BLUFF_CAPTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE game_status AS ENUM ('LOBBY', 'IN_PROGRESS', 'ROUND_REVEAL', 'COMPLETED', 'ABANDONED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'PRINTING', 'SHIPPED', 'DELIVERED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- 4. AUTH IDENTITIES (Google OAuth, Apple, Magic Link)
CREATE TABLE IF NOT EXISTS auth_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'apple', 'local'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_provider_user UNIQUE(provider, provider_user_id)
);

-- 5. PODS (The Multi-Tenant Workspace Container)
CREATE TABLE IF NOT EXISTS pods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type pod_type NOT NULL DEFAULT 'SQUAD',
    room_code VARCHAR(8) UNIQUE NOT NULL, -- 4-8 chars (e.g., 'FIRE')
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMPTZ,
    encryption_key_id VARCHAR(255) NOT NULL, -- Client-scoped KMS key ID
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

-- 7. MEMORIES (The Core Vault)
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255),
    raw_text TEXT,
    ocr_extracted_text TEXT,
    event_timestamp TIMESTAMPTZ,
    is_playable BOOLEAN DEFAULT TRUE,
    is_private_to_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEMORY MEDIA FILES (S3 / Cloudflare R2 files)
CREATE TABLE IF NOT EXISTS memory_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    storage_key TEXT NOT NULL,
    blur_hash VARCHAR(100),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    waveform_data JSONB, -- For audio voice notes
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
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GAME ROUNDS (Pre-generated AI Card Deck)
CREATE TABLE IF NOT EXISTS game_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
    round_number INT NOT NULL,
    question_prompt TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 answer strings: ["Option A", "Option B", ...]
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

-- 12. YEARBOOKS & ALBUMS
CREATE TABLE IF NOT EXISTS yearbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    season_name VARCHAR(100) NOT NULL, -- e.g. "Yearbook 2026"
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
    template_type VARCHAR(50) NOT NULL, -- 'QUOTE_SPREAD', 'AWARD_ROAST', 'PHOTO_COLLAGE'
    content_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_yearbook_page UNIQUE(yearbook_id, page_number)
);

-- 14. ORDERS & MONETIZATION
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    pod_id UUID NOT NULL REFERENCES pods(id),
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

-- ==============================================================================
-- STRATEGIC PERFORMANCE & SEARCH INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pods_room_code ON pods(room_code);
CREATE INDEX IF NOT EXISTS idx_pod_memberships_pod_user ON pod_memberships(pod_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memories_pod_playable ON memories(pod_id, is_playable);
CREATE INDEX IF NOT EXISTS idx_game_sessions_pod ON game_sessions(pod_id, status);
CREATE INDEX IF NOT EXISTS idx_game_rounds_session ON game_rounds(game_session_id);
CREATE INDEX IF NOT EXISTS idx_player_votes_round ON player_votes(game_round_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_ocr_search ON memories USING gin(to_tsvector('english', COALESCE(ocr_extracted_text, '')));

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pods_modtime BEFORE UPDATE ON pods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
