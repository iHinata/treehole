import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { useToast } from '../components/ToastContext'
import { getAvatarColor, getAvatarEmoji } from '../lib/utils'
import '../styles/pages/profile.less'

// ─── 动画变体 ───────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.06,
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  }),
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
}

// ─── 菜单配置 ───────────────────────────────────────────────
interface MenuItemConfig {
  icon: string
  label: string
  action: () => void
}

// ─── 组件 ───────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0 })
  const [loading, setLoading] = useState(true)

  // 获取用户统计数据
  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      try {
        const [postsRes, commentsRes] = await Promise.all([
          supabase
            .from('posts')
            .select('id, likes_count')
            .eq('user_id', user.id),
          supabase
            .from('comments')
            .select('id, likes_count')
            .eq('user_id', user.id),
        ])

        const posts = postsRes.data ?? []
        const comments = commentsRes.data ?? []

        const totalLikes =
          posts.reduce((sum, p) => sum + (p.likes_count ?? 0), 0) +
          comments.reduce((sum, c) => sum + (c.likes_count ?? 0), 0)

        setStats({
          posts: posts.length,
          comments: comments.length,
          likes: totalLikes,
        })
      } catch {
        // 静默失败，显示 0
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  // 用户名
  const username = user?.user_metadata?.nickname
    ?? user?.email?.split('@')[0]
    ?? '树洞用户'

  // 加入日期
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // 头像
  const avatarColor = user ? getAvatarColor(user.id) : '#A8E6CF'
  const avatarEmoji = user ? getAvatarEmoji(user.id) : '🌸'

  // 菜单项
  const menuItems: MenuItemConfig[] = [
    {
      icon: '📝',
      label: '我的帖子',
      action: () => navigate('/'),
    },
    {
      icon: '💬',
      label: '我的评论',
      action: () => showToast('功能开发中', 'info'),
    },
    {
      icon: '❤️',
      label: '我的收藏',
      action: () => showToast('功能开发中', 'info'),
    },
    {
      icon: '⚙️',
      label: '账号设置',
      action: () => showToast('功能开发中', 'info'),
    },
    {
      icon: '📋',
      label: '关于我们',
      action: () => showToast('功能开发中', 'info'),
    },
  ]

  // 退出登录
  const handleSignOut = async () => {
    await signOut()
    showToast('已退出登录', 'success')
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="profile-page"
    >
      {/* ─── 个人信息头部 ─── */}
      <div className="profile-header">
        {/* 装饰圆 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center">
          {/* 头像 */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="profile-avatar"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarEmoji}
          </motion.div>

          {/* 用户名 */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="profile-name"
          >
            {username}
          </motion.h1>

          {/* 加入日期 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="profile-join-date"
          >
            {joinDate ? `${joinDate} 加入` : ''}
          </motion.p>

          {/* 编辑资料按钮 */}
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast('功能开发中', 'info')}
            className="edit-btn"
          >
            编辑资料
          </motion.button>
        </div>
      </div>

      {/* ─── 统计区域 ─── */}
      <div className="stats-card">
        <div className="grid grid-cols-3 divide-x divide-border">
          {[
            { value: stats.posts, label: '我的帖子' },
            { value: stats.comments, label: '我的评论' },
            { value: stats.likes, label: '获赞数' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statsVariants}
              initial="hidden"
              animate="visible"
              className="stat-item"
            >
              <span className="stat-number">
                {loading ? '-' : stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── 菜单列表 ─── */}
      <div className="menu-list">
        <div className="menu-card">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              custom={i}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="menu-item"
            >
              <span className="menu-left">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">
                  {item.label}
                </span>
              </span>
              <span className="menu-arrow">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── 退出登录按钮 ─── */}
      <div className="logout-section">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignOut}
          className="logout-btn"
        >
          退出登录
        </motion.button>
      </div>

      {/* ─── 底部导航栏 ─── */}
      <nav className="bottom-nav">
        <div className="nav-content">
          {/* 首页 */}
          <button
            onClick={() => navigate('/')}
            className="nav-item"
          >
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.689z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
            </svg>
            <span>首页</span>
          </button>

          {/* 发布 */}
          <button onClick={() => navigate('/publish')} className="nav-item">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>发布</span>
          </button>

          {/* 我的 (active) */}
          <button className="nav-item active">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            <span>我的</span>
          </button>
        </div>
      </nav>
    </motion.div>
  )
}
