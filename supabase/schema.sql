-- ============================================================
-- 树洞 (Tree Hole) App - Supabase Database Schema
-- ============================================================

-- -----------------------------------------------------------
-- 1. profiles 表 - 用户资料
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT NOT NULL DEFAULT '匿名树洞用户',
  avatar_color TEXT NOT NULL DEFAULT '#6366f1',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- 2. posts 表 - 树洞帖子
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  content        TEXT NOT NULL,
  category       TEXT NOT NULL DEFAULT '其他'
                 CHECK (category IN ('情感', '生活', '学习', '工作', '其他')),
  is_anonymous   BOOLEAN NOT NULL DEFAULT true,
  likes_count    INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- 3. comments 表 - 帖子评论
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  likes_count  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- 4. post_likes 表 - 帖子点赞（多对多）
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id  UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- -----------------------------------------------------------
-- 5. comment_likes 表 - 评论点赞（多对多）
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comment_likes (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

-- ============================================================
-- 6. Row Level Security (RLS) 策略
-- ============================================================

-- 启用 RLS
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- 6.1 profiles RLS
-- -----------------------------------------------------------
-- 所有已认证用户可以查看所有资料
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------
-- 6.2 posts RLS
-- -----------------------------------------------------------
-- 任何人都可以查看帖子
CREATE POLICY "posts_select" ON public.posts
  FOR SELECT USING (true);

-- 已认证用户可以创建帖子
CREATE POLICY "posts_insert" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 只有帖子作者可以更新
CREATE POLICY "posts_update" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 只有帖子作者可以删除
CREATE POLICY "posts_delete" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------
-- 6.3 comments RLS
-- -----------------------------------------------------------
-- 任何人都可以查看评论
CREATE POLICY "comments_select" ON public.comments
  FOR SELECT USING (true);

-- 已认证用户可以创建评论
CREATE POLICY "comments_insert" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 只有评论作者可以更新
CREATE POLICY "comments_update" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 只有评论作者可以删除
CREATE POLICY "comments_delete" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------
-- 6.4 post_likes RLS
-- -----------------------------------------------------------
-- 已认证用户可以查看点赞记录
CREATE POLICY "post_likes_select" ON public.post_likes
  FOR SELECT USING (auth.uid() = user_id);

-- 已认证用户可以插入点赞记录
CREATE POLICY "post_likes_insert" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 已认证用户只能删除自己的点赞记录
CREATE POLICY "post_likes_delete" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------
-- 6.5 comment_likes RLS
-- -----------------------------------------------------------
-- 已认证用户可以查看点赞记录
CREATE POLICY "comment_likes_select" ON public.comment_likes
  FOR SELECT USING (auth.uid() = user_id);

-- 已认证用户可以插入点赞记录
CREATE POLICY "comment_likes_insert" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 已认证用户只能删除自己的点赞记录
CREATE POLICY "comment_likes_delete" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 7. 函数 (Functions)
-- ============================================================

-- -----------------------------------------------------------
-- 7.1 increment_post_likes - 帖子点赞数 +1
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_post_likes(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET likes_count = likes_count + 1
  WHERE id = p_post_id;
END;
$$;

-- -----------------------------------------------------------
-- 7.2 decrement_post_likes - 帖子点赞数 -1
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_post_likes(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = p_post_id;
END;
$$;

-- -----------------------------------------------------------
-- 7.3 increment_post_comments - 帖子评论数 +1
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_post_comments(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = comments_count + 1
  WHERE id = p_post_id;
END;
$$;

-- -----------------------------------------------------------
-- 7.4 decrement_post_comments - 帖子评论数 -1
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_post_comments(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = p_post_id;
END;
$$;

-- -----------------------------------------------------------
-- 7.5 handle_new_user - 新用户注册时自动创建 profile
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', '匿名树洞用户'),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_color', '#6366f1')
  );
  RETURN NEW;
END;
$$;

-- ============================================================
-- 8. 触发器 (Triggers)
-- ============================================================

-- 在 auth.users 插入时自动创建 profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 9. 索引 (Indexes) - 优化查询性能
-- ============================================================

-- posts 按分类查询
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);

-- posts 按创建时间排序
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- posts 按用户查询
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);

-- comments 按帖子查询
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- comments 按创建时间排序
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- post_likes 按帖子查询
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);

-- comment_likes 按评论查询
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
