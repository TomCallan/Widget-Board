-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_tier AS ENUM ('free', 'premium');
CREATE TYPE permission_type AS ENUM ('view', 'edit');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    github_id BIGINT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    full_name TEXT,
    tier user_tier DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dashboards table
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    widgets JSONB DEFAULT '[]'::jsonb,
    color_scheme TEXT DEFAULT 'purple',
    locked BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dashboard_shares table
CREATE TABLE dashboard_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE,
    permissions permission_type DEFAULT 'view',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX idx_dashboards_is_public ON dashboards(is_public);
CREATE INDEX idx_dashboard_shares_dashboard_id ON dashboard_shares(dashboard_id);
CREATE INDEX idx_dashboard_shares_token ON dashboard_shares(share_token);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to enforce dashboard limits for free users
CREATE OR REPLACE FUNCTION check_dashboard_limit()
RETURNS TRIGGER AS $$
DECLARE
    user_tier_val user_tier;
    dashboard_count INTEGER;
BEGIN
    -- Get user tier
    SELECT tier INTO user_tier_val FROM users WHERE id = NEW.user_id;
    
    -- Only check for free users
    IF user_tier_val = 'free' THEN
        -- Count existing dashboards
        SELECT COUNT(*) INTO dashboard_count FROM dashboards WHERE user_id = NEW.user_id;
        
        -- Enforce limit of 3 dashboards for free users
        IF dashboard_count >= 3 THEN
            RAISE EXCEPTION 'Free users are limited to 3 dashboards. Upgrade to premium for unlimited dashboards.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for dashboard limit
CREATE TRIGGER enforce_dashboard_limit BEFORE INSERT ON dashboards
    FOR EACH ROW EXECUTE FUNCTION check_dashboard_limit();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can only access their own dashboards
CREATE POLICY "Users can view own dashboards" ON dashboards
    FOR SELECT USING (
        auth.uid()::text = user_id::text 
        OR is_public = true
        OR id IN (
            SELECT dashboard_id FROM dashboard_shares 
            WHERE shared_with_user_id::text = auth.uid()::text
            OR (share_token IS NOT NULL AND shared_with_user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert own dashboards" ON dashboards
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own dashboards" ON dashboards
    FOR UPDATE USING (
        auth.uid()::text = user_id::text
        OR id IN (
            SELECT dashboard_id FROM dashboard_shares 
            WHERE shared_with_user_id::text = auth.uid()::text 
            AND permissions = 'edit'
        )
    );

CREATE POLICY "Users can delete own dashboards" ON dashboards
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Dashboard shares policies
CREATE POLICY "Users can view shares for their dashboards" ON dashboard_shares
    FOR SELECT USING (
        shared_by_user_id::text = auth.uid()::text 
        OR shared_with_user_id::text = auth.uid()::text
    );

CREATE POLICY "Users can create shares for their dashboards" ON dashboard_shares
    FOR INSERT WITH CHECK (
        shared_by_user_id::text = auth.uid()::text
        AND EXISTS (
            SELECT 1 FROM dashboards 
            WHERE id = dashboard_id AND user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete their own shares" ON dashboard_shares
    FOR DELETE USING (shared_by_user_id::text = auth.uid()::text);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, github_id, email, username, avatar_url, full_name)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'provider_id')::bigint,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 