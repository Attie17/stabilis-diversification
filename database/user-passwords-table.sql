-- User Passwords Table
-- Stores encrypted user passwords for cross-deployment persistence

CREATE TABLE IF NOT EXISTS user_passwords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_passwords_name ON user_passwords(user_name);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_user_passwords_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_passwords_timestamp
    BEFORE UPDATE ON user_passwords
    FOR EACH ROW
    EXECUTE FUNCTION update_user_passwords_timestamp();

COMMENT ON TABLE user_passwords IS 'Stores user passwords (base64 encoded) for authentication across deployments';
COMMENT ON COLUMN user_passwords.password_hash IS 'Base64 encoded password - same encoding as localStorage for compatibility';
