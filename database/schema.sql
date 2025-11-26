-- Stabilis AI Assistant - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Milestones table (synced from static JS data)
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    phase_id TEXT NOT NULL,
    phase_name TEXT,
    owner TEXT,
    due_date DATE,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'blocked')),
    description TEXT,
    revenue NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestone updates history (audit trail)
CREATE TABLE IF NOT EXISTS milestone_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id TEXT REFERENCES milestones(id) ON DELETE CASCADE,
    field_changed TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT NOT NULL,
    notes TEXT,
    is_financial BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN milestone_updates.is_financial IS 'TRUE if change affects revenue/budget tracking';

CREATE INDEX IF NOT EXISTS idx_milestone_updates_milestone ON milestone_updates(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_updates_timestamp ON milestone_updates(timestamp DESC);

-- Alerts (proactive notifications)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('deadline', 'overdue', 'inactivity', 'revenue_variance', 'risk')),
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    milestone_id TEXT REFERENCES milestones(id) ON DELETE SET NULL,
    phase_id TEXT,
    message TEXT NOT NULL,
    details JSONB,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged) WHERE NOT acknowledged;
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);

-- AI conversations (chat history)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id TEXT,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    function_calls JSONB,
    tokens_used INTEGER,
    response_time_ms INTEGER,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_thread ON conversations(thread_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);

-- Change log (file system changes)
CREATE TABLE IF NOT EXISTS change_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_path TEXT NOT NULL,
    change_type TEXT CHECK (change_type IN ('milestone_data', 'code', 'config', 'documentation')),
    diff_summary TEXT,
    lines_added INTEGER DEFAULT 0,
    lines_removed INTEGER DEFAULT 0,
    full_diff TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_log_file ON change_log(file_path);
CREATE INDEX IF NOT EXISTS idx_change_log_timestamp ON change_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_change_log_type ON change_log(change_type);

-- Research cache (web search results)
CREATE TABLE IF NOT EXISTS research_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL,
    results JSONB NOT NULL,
    source TEXT DEFAULT 'tavily',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_cache_query ON research_cache(query);
CREATE INDEX IF NOT EXISTS idx_research_cache_expires ON research_cache(expires_at);

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to milestones
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
CREATE TRIGGER update_milestones_updated_at
    BEFORE UPDATE ON milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Helper view: Recent alerts
CREATE OR REPLACE VIEW recent_alerts AS
SELECT 
    a.*,
    m.title as milestone_title,
    m.owner as milestone_owner
FROM alerts a
LEFT JOIN milestones m ON a.milestone_id = m.id
WHERE NOT a.acknowledged
ORDER BY 
    CASE a.severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        ELSE 3
    END,
    a.created_at DESC;

-- Helper view: Overdue milestones
CREATE OR REPLACE VIEW overdue_milestones AS
SELECT *
FROM milestones
WHERE due_date < CURRENT_DATE
  AND status NOT IN ('completed');

-- Helper view: Project progress summary
CREATE OR REPLACE VIEW project_progress AS
SELECT 
    phase_id,
    phase_name,
    COUNT(*) as total_milestones,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
    COUNT(*) FILTER (WHERE status = 'blocked') as blocked,
    SUM(revenue) as total_revenue,
    SUM(revenue) FILTER (WHERE status = 'completed') as earned_revenue
FROM milestones
GROUP BY phase_id, phase_name
ORDER BY phase_id;

COMMENT ON TABLE milestones IS 'Core project milestones synced from static data.js files';
COMMENT ON TABLE milestone_updates IS 'History of all changes to milestones';
COMMENT ON TABLE alerts IS 'Proactive notifications generated by alert service';
COMMENT ON TABLE conversations IS 'AI chat history for analytics and continuity';
COMMENT ON TABLE change_log IS 'File system changes detected by watcher';
COMMENT ON TABLE research_cache IS 'Cached web search results to reduce API calls';
