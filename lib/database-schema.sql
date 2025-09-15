-- MVP 数据库架构（Supabase PostgreSQL）

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户档案表
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    credits_remaining INTEGER DEFAULT 5 CHECK (credits_remaining >= 0),
    preferences JSONB DEFAULT '{}',
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
    cultural_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 名字记录表
CREATE TABLE IF NOT EXISTS public.names (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    english_name TEXT NOT NULL,
    chinese_name TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    meaning TEXT,
    style TEXT DEFAULT 'modern' CHECK (style IN ('traditional', 'modern', 'elegant', 'nature', 'literary')),
    generation_type TEXT DEFAULT 'basic' CHECK (generation_type IN ('basic', 'wuxing', 'poetry', 'enterprise')),
    source_data JSONB DEFAULT '{}',
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 100),
    metadata JSONB DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 支付记录表
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    credits_purchased INTEGER NOT NULL CHECK (credits_purchased > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 内容源表（用于诗词、文化数据等）
CREATE TABLE IF NOT EXISTS public.content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('poetry', 'cultural_data', 'calligraphy_template')),
    title TEXT NOT NULL,
    content_data JSONB NOT NULL,
    tags TEXT[],
    search_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 用户作品表（统一管理所有类型作品）
CREATE TABLE IF NOT EXISTS public.user_works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name_id UUID REFERENCES public.names(id) ON DELETE CASCADE,
    work_type TEXT NOT NULL CHECK (work_type IN ('calligraphy', 'cultural_report', 'shared_story')),
    work_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON public.user_profiles(subscription_tier, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_names_user_created ON public.names(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_names_favorites ON public.names(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_names_generation_type ON public.names(generation_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_names_style ON public.names(style, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON public.payments(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- 为type字段创建btree索引，为tags数组创建GIN索引
CREATE INDEX IF NOT EXISTS idx_content_sources_type ON public.content_sources(type);
CREATE INDEX IF NOT EXISTS idx_content_sources_tags ON public.content_sources USING GIN(tags);
-- 如需更好的中文搜索支持，请先安装中文文本搜索配置
-- 当前使用simple配置确保兼容性
CREATE INDEX IF NOT EXISTS idx_content_sources_search ON public.content_sources USING GIN(to_tsvector('simple', COALESCE(search_text, '')));

CREATE INDEX IF NOT EXISTS idx_user_works_type_public ON public.user_works(work_type, is_public, created_at DESC) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_works_user_type ON public.user_works(user_id, work_type, created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_works ENABLE ROW LEVEL SECURITY;

-- 用户档案策略
CREATE POLICY "用户只能查看和修改自己的档案" ON public.user_profiles
    FOR ALL USING (auth.uid() = id);

-- 名字记录策略
CREATE POLICY "用户只能操作自己的名字记录" ON public.names
    FOR ALL USING (auth.uid() = user_id);

-- 支付记录策略
CREATE POLICY "用户只能查看自己的支付记录" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "系统可以创建支付记录" ON public.payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "系统可以更新支付记录" ON public.payments
    FOR UPDATE USING (true);

-- 内容源策略（公开可读）
CREATE POLICY "内容源公开可读" ON public.content_sources
    FOR SELECT USING (true);

-- 用户作品策略
CREATE POLICY "用户可以操作自己的作品" ON public.user_works
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "公开作品可以被所有人查看" ON public.user_works
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

-- 创建触发器来自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 实用函数：添加积分
CREATE OR REPLACE FUNCTION public.add_credits(user_email TEXT, credits_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_profiles
    SET credits_remaining = credits_remaining + credits_to_add,
        updated_at = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 实用函数：扣除积分
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id UUID, credits_to_deduct INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits_remaining INTO current_credits
    FROM public.user_profiles
    WHERE id = user_id;

    IF current_credits >= credits_to_deduct THEN
        UPDATE public.user_profiles
        SET credits_remaining = credits_remaining - credits_to_deduct,
            updated_at = NOW()
        WHERE id = user_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 实用函数：搜索诗词内容
CREATE OR REPLACE FUNCTION public.search_poetry_content(
    search_term TEXT,
    theme_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content_data JSONB,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cs.id,
        cs.title,
        cs.content_data,
        ts_rank(
            to_tsvector('simple', COALESCE(cs.search_text, '')),
            plainto_tsquery('simple', search_term)
        ) AS relevance
    FROM public.content_sources cs
    WHERE cs.type = 'poetry'
        AND to_tsvector('simple', COALESCE(cs.search_text, '')) @@ plainto_tsquery('simple', search_term)
        AND (theme_filter IS NULL OR cs.tags && theme_filter)
    ORDER BY relevance DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 插入一些示例内容源数据
INSERT INTO public.content_sources (type, title, content_data, tags, search_text) VALUES
('poetry', '经典诗词库', '{
    "poems": [
        {
            "title": "静夜思",
            "author": "李白",
            "dynasty": "唐",
            "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
            "themes": ["思乡", "月亮", "宁静"]
        }
    ]
}', ARRAY['classical', 'tang_poetry', 'homesickness'], '静夜思 李白 床前明月光 思乡 月亮 宁静'),

('cultural_data', '中国传统文化知识', '{
    "categories": {
        "five_elements": {
            "metal": {"meaning": "金", "attributes": ["坚韧", "果断", "锐利"]},
            "wood": {"meaning": "木", "attributes": ["生长", "柔韧", "生机"]},
            "water": {"meaning": "水", "attributes": ["智慧", "流动", "包容"]},
            "fire": {"meaning": "火", "attributes": ["热情", "光明", "活力"]},
            "earth": {"meaning": "土", "attributes": ["稳重", "包容", "厚德"]}
        }
    }
}', ARRAY['traditional_culture', 'five_elements'], '五行 金木水火土 传统文化 中国文化');

-- 创建默认的用户档案触发器
-- 注意：此触发器专为Supabase环境设计，需要auth.users表存在
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, display_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.email, ''), 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 当新用户注册时自动创建档案
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();