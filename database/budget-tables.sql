-- Budget Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Budget Summary Table
CREATE TABLE IF NOT EXISTS budget_summary (
    id SERIAL PRIMARY KEY,
    budget_period TEXT NOT NULL UNIQUE,
    total_budget NUMERIC(12,2),
    expected_revenue NUMERIC(12,2),
    net_deficit NUMERIC(12,2),
    funding_required NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Monthly Cash Flow Table
CREATE TABLE IF NOT EXISTS budget_monthly (
    id SERIAL PRIMARY KEY,
    budget_period TEXT NOT NULL,
    month TEXT NOT NULL,
    month_order INTEGER NOT NULL,
    revenue NUMERIC(12,2),
    expenditure NUMERIC(12,2),
    net_cash_flow NUMERIC(12,2),
    cumulative NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(budget_period, month)
);

-- Budget Expenditure Breakdown Table
CREATE TABLE IF NOT EXISTS budget_expenditure (
    id SERIAL PRIMARY KEY,
    budget_period TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12,2),
    percentage NUMERIC(5,4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(budget_period, category)
);

-- Budget Revenue by Project Table
CREATE TABLE IF NOT EXISTS budget_revenue (
    id SERIAL PRIMARY KEY,
    budget_period TEXT NOT NULL,
    project TEXT NOT NULL,
    total_revenue NUMERIC(12,2),
    monthly_avg NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(budget_period, project)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_budget_monthly_period ON budget_monthly(budget_period);
CREATE INDEX IF NOT EXISTS idx_budget_expenditure_period ON budget_expenditure(budget_period);
CREATE INDEX IF NOT EXISTS idx_budget_revenue_period ON budget_revenue(budget_period);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all budget tables
CREATE TRIGGER update_budget_summary_updated_at BEFORE UPDATE ON budget_summary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_monthly_updated_at BEFORE UPDATE ON budget_monthly
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_expenditure_updated_at BEFORE UPDATE ON budget_expenditure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_revenue_updated_at BEFORE UPDATE ON budget_revenue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
ALTER TABLE budget_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_expenditure ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_revenue ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to budget_summary" ON budget_summary FOR SELECT USING (true);
CREATE POLICY "Allow read access to budget_monthly" ON budget_monthly FOR SELECT USING (true);
CREATE POLICY "Allow read access to budget_expenditure" ON budget_expenditure FOR SELECT USING (true);
CREATE POLICY "Allow read access to budget_revenue" ON budget_revenue FOR SELECT USING (true);

-- Comment tables
COMMENT ON TABLE budget_summary IS 'High-level budget summary by period (Q1-2026, FY-2026-27, etc.)';
COMMENT ON TABLE budget_monthly IS 'Monthly cash flow breakdown for each budget period';
COMMENT ON TABLE budget_expenditure IS 'Expenditure categories and amounts by budget period';
COMMENT ON TABLE budget_revenue IS 'Revenue by project/stream for each budget period';
