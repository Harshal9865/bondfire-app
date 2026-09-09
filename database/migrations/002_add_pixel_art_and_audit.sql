-- ==============================================================================
-- MIGRATION 002: PIXEL ART GRAFFITI & AUDIT LOGGING SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS pixel_art_artworks (
    id VARCHAR(36) PRIMARY KEY,
    pod_id VARCHAR(36) NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
    created_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL DEFAULT 'Campfire Pixel Art',
    grid_data TEXT NOT NULL, -- Compressed 32x32 hex palette strings
    image_data_uri TEXT,     -- Rendered PNG data URI for 3D yearbook page insertion
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pixel_art_pod_id ON pixel_art_artworks(pod_id);

CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(36) PRIMARY KEY,
    correlation_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    actor_user_id VARCHAR(36) NOT NULL,
    pod_id VARCHAR(36),
    ip_address VARCHAR(45),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);
