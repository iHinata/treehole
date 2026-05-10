import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import type { Category } from '../types'
import { CATEGORIES } from '../types'
import { getCategoryColor } from '../lib/utils'
import { useToast } from '../components/ToastContext'
import '../styles/pages/post.less'

// ─── 动画变体 ───────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: 0.1 },
  },
}

const bottomBarVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const, delay: 0.2 },
  },
}

// ─── 主页面组件 ─────────────────────────────────────────────
export default function PostPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('情感')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 发布帖子
  const handlePublish = async () => {
    // 验证标题和内容
    if (!title.trim()) {
      showToast('请输入标题', 'warning')
      return
    }
    if (!content.trim()) {
      showToast('请输入内容', 'warning')
      return
    }
    if (!user) {
      showToast('请先登录', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        is_anonymous: isAnonymous,
      })

      if (error) {
        console.error('发布失败:', error)
        showToast('发布失败，请稍后重试', 'error')
        return
      }

      showToast('发布成功！', 'success')
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (err) {
      console.error('发布异常:', err)
      showToast('发布异常，请稍后重试', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 取消发布
  const handleCancel = () => {
    navigate(-1)
  }

  const isFormValid = title.trim().length > 0 && content.trim().length > 0

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="post-page"
    >
      {/* ─── 顶部导航栏 ─── */}
      <header className="nav-bar">
        <div className="nav-content">
          {/* 取消按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            className="cancel-btn"
          >
            <span className="text-lg">×</span>
            <span className="text-sm">取消</span>
          </motion.button>

          {/* 页面标题 */}
          <h1 className="page-title">发布树洞</h1>

          {/* 发布按钮 */}
          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.92 }}
            onClick={handlePublish}
            disabled={isSubmitting || !isFormValid}
            className="publish-btn"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              '发布'
            )}
          </motion.button>
        </div>
      </header>

      {/* ─── 主内容卡片 ─── */}
      <div className="form-area">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="form-card"
        >
          {/* 标题输入 */}
          <div className="form-group">
            <label className="form-label">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              placeholder="给你的树洞起个标题吧~"
              maxLength={50}
              className="form-input"
            />
            <div className="char-count">
              {title.length}/50
            </div>
          </div>

          {/* 内容输入 */}
          <div className="form-group">
            <label className="form-label">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 500))}
              placeholder="在这里写下你想说的话..."
              maxLength={500}
              rows={10}
              className="form-textarea"
            />
            <div className="char-count">
              {content.length}/500
            </div>
          </div>

          {/* 分类选择 */}
          <div className="category-group">
            <label className="form-label">选择分类</label>
            <LayoutGroup>
              <div className="category-list">
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat
                  return (
                    <motion.button
                      key={cat}
                      layout
                      onClick={() => setCategory(cat)}
                      className={`category-item${isActive ? ' active' : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          className="absolute inset-0 bg-soft-pink rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <span
                          className="cat-dot"
                          style={{ backgroundColor: getCategoryColor(cat) }}
                        />
                        {cat}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </LayoutGroup>
          </div>
        </motion.div>
      </div>

      {/* ─── 底部匿名发布栏 ─── */}
      <motion.div
        variants={bottomBarVariants}
        initial="hidden"
        animate="visible"
        className="bottom-bar"
      >
        <div className="bar-content">
          {/* 左侧：锁图标 + 文字 */}
          <div className="anonymous-info">
            <div className={`lock-icon${isAnonymous ? ' active' : ''}`}>
              <svg
                className={isAnonymous ? 'active' : ''}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="anonymous-text">
              <p className="text-main">匿名发布</p>
              <p className="text-sub">你的身份将被保护</p>
            </div>
          </div>

          {/* 右侧：开关 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`toggle-switch${isAnonymous ? ' active' : ''}`}
          >
            <motion.div
              className={`toggle-knob${isAnonymous ? ' active' : ''}`}
              animate={{ left: isAnonymous ? '1.375rem' : '0.125rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
