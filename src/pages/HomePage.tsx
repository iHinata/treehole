import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { useToast } from '../components/ToastContext'
import type { TreeHolePost, Category } from '../types'
import { CATEGORIES } from '../types'
import {
  getAvatarColor,
  getAvatarEmoji,
  formatTimeAgo,
  truncateText,
  getCategoryColor,
} from '../lib/utils'
import '../styles/pages/home.less'

// ─── 动画变体 ───────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
}

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

// ─── 骨架屏组件 ─────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      custom={index}
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="skeleton-card"
    >
      <div className="skeleton-header">
        {/* 头像骨架 */}
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          {/* 标题骨架 */}
          <div className="skeleton-line skeleton-line-title" />
          {/* 内容骨架 */}
          <div className="skeleton-content">
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-short" />
          </div>
          {/* 底部信息骨架 */}
          <div className="skeleton-line skeleton-line-footer">
            <div className="skeleton-line skeleton-line-tag" />
            <div className="skeleton-line skeleton-line-tag" />
            <div className="skeleton-line skeleton-line-tag" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── 帖子卡片组件 ───────────────────────────────────────────
function PostCard({
  post,
  index,
  onClick,
  onLike,
}: {
  post: TreeHolePost
  index: number
  onClick: () => void
  onLike: () => void
}) {
  const categoryColor = getCategoryColor(post.category)
  const avatarColor = post.is_anonymous
    ? '#E6E6FA'
    : getAvatarColor(post.user_id)
  const avatarEmoji = post.is_anonymous ? '👻' : getAvatarEmoji(post.user_id)

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.015, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="post-card"
      style={{ borderLeftColor: categoryColor }}
    >
      <div className="post-header">
        {/* 头像 */}
        <div
          className="post-avatar"
          style={{ backgroundColor: avatarColor }}
        >
          {avatarEmoji}
        </div>

        {/* 内容 */}
        <div className="post-meta" onClick={onClick}>
          {/* 标题 */}
          <h3 className="post-title">
            {post.title}
          </h3>

          {/* 预览文本 */}
          <p className="post-content">
            {truncateText(post.content, 80)}
          </p>

          {/* 底部信息 */}
          <div className="post-footer">
            <span className="post-time">{formatTimeAgo(post.created_at)}</span>
            <span className="stat-item">
              <svg
                className="svg-icon"
                width={14}
                height={14}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comments_count}</span>
            </span>
            <motion.span
              className="stat-item"
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation()
                onLike()
              }}
            >
              <svg
                className="svg-icon"
                width={14}
                height={14}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span>{post.likes_count}</span>
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── 主页面组件 ─────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { showToast } = useToast()

  const [posts, setPosts] = useState<TreeHolePost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Category | '全部'>('全部')
  const [searchQuery, setSearchQuery] = useState('')

  // 获取帖子列表
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (activeCategory !== '全部') {
        query = query.eq('category', activeCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('获取帖子失败:', error)
        showToast('获取帖子失败，请稍后重试', 'error')
        return
      }

      setPosts((data as TreeHolePost[]) ?? [])
    } catch (err) {
      console.error('获取帖子异常:', err)
      showToast('网络错误，请检查网络连接', 'error')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, showToast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 点赞/取消点赞功能
  const handleLike = useCallback(async (postId: string) => {
    if (!user) {
      showToast('请先登录', 'error')
      return
    }

    const post = posts.find(p => p.id === postId)
    if (!post) return

    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle()

    const wasLiked = !!existingLike

    // 乐观更新
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, likes_count: wasLiked ? Math.max(p.likes_count - 1, 0) : p.likes_count + 1 }
          : p
      )
    )

    try {
      if (wasLiked) {
        // 取消点赞
        await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', postId)
        await supabase.rpc('decrement_post_likes', { p_post_id: postId })
        showToast('已取消点赞', 'info')
      } else {
        // 点赞
        await supabase.from('post_likes').insert({ user_id: user.id, post_id: postId })
        await supabase.rpc('increment_post_likes', { p_post_id: postId })
        showToast('点赞成功', 'success')
      }
    } catch (err) {
      console.error('点赞操作失败:', err)
      showToast('操作失败，请重试', 'error')
      // 回滚
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likes_count: wasLiked ? p.likes_count + 1 : Math.max(p.likes_count - 1, 0) }
            : p
        )
      )
    }
  }, [user, posts, showToast])

  // 本地搜索过滤
  const filteredPosts = searchQuery.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : posts

  // 切换分类
  const handleCategoryChange = (cat: Category | '全部') => {
    setActiveCategory(cat)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="home-page"
    >
      {/* ─── 顶部导航栏 ─── */}
      <header className="header">
        <div className="header-content">
          {/* Logo + 标题 */}
          <div className="logo">
            <div className="logo-icon">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <span className="logo-text">树洞</span>
          </div>

          {/* 搜索框 */}
          <div className="search-bar">
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="搜索树洞..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-wrapper input"
              />
            </div>
          </div>

          {/* 用户头像 + 发布按钮 */}
          <div className="header-actions">
            <div
              className="avatar"
              style={{ backgroundColor: user ? getAvatarColor(user.id) : '#E6E6FA' }}
            >
              {user ? getAvatarEmoji(user.id) : '👤'}
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/publish')}
              className="publish-btn"
            >
              +
            </motion.button>
          </div>
        </div>
      </header>

      {/* ─── 分类标签栏 ─── */}
      <div className="category-bar">
        <div className="category-content">
          <LayoutGroup>
            <div className="category-list">
              <motion.button
                layout
                onClick={() => handleCategoryChange('全部')}
                className={`category-pill ${activeCategory === '全部' ? 'active' : ''}`}
              >
                {activeCategory === '全部' && (
                  <motion.div
                    layoutId="activeCategory"
                    className="category-pill-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="category-pill-text">全部</span>
              </motion.button>

              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  layout
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                >
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="activeCategory"
                      className="category-pill-bg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="category-pill-text">{cat}</span>
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* ─── 帖子列表 ─── */}
      <div className="post-list">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="skeleton-list"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              <div className="empty-state-icon">
                <svg
                  className="w-10 h-10 text-light/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <p className="empty-state-text">
                {searchQuery ? '没有找到匹配的树洞' : '这里还没有树洞'}
              </p>
              <p className="empty-state-hint">
                {searchQuery ? '换个关键词试试吧' : '点击右上角 + 发布第一个树洞吧'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="post-list-items"
            >
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onClick={() => navigate(`/post/${post.id}`)}
                  onLike={() => handleLike(post.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── 底部导航栏 ─── */}
      <nav className="bottom-nav">
        <div className="nav-content">
          {/* 首页 */}
          <button className="nav-item active">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.689z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
            </svg>
            <span className="text-xs font-medium">首页</span>
          </button>

          {/* 发布 */}
          <button onClick={() => navigate('/publish')} className="nav-item">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs font-medium">发布</span>
          </button>

          {/* 我的 */}
          <button onClick={() => navigate('/profile')} className="nav-item">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-xs font-medium">我的</span>
          </button>
        </div>
      </nav>
    </motion.div>
  )
}
