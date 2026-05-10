import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { useToast } from '../components/ToastContext'
import type { TreeHolePost, Comment } from '../types'
import { getAvatarColor, getAvatarEmoji, formatTimeAgo } from '../lib/utils'
import '../styles/pages/detail.less'

// ─── 动画变体 ───────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
}

const postCardVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

const commentVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  }),
}

const newCommentVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
}

// ─── 主页面组件 ─────────────────────────────────────────────
export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [post, setPost] = useState<TreeHolePost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [postLiked, setPostLiked] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set())

  const inputRef = useRef<HTMLInputElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // ─── 获取帖子详情 ───
  const fetchPost = useCallback(async () => {
    if (!id) return
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('获取帖子失败:', error)
        return
      }

      setPost(data as TreeHolePost)
    } catch (err) {
      console.error('获取帖子异常:', err)
    }
  }, [id])

  // ─── 获取评论列表 ───
  const fetchComments = useCallback(async () => {
    if (!id) return
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('获取评论失败:', error)
        return
      }

      setComments((data as Comment[]) ?? [])
    } catch (err) {
      console.error('获取评论异常:', err)
    }
  }, [id])

  // ─── 检查当前用户是否已点赞帖子 ───
  const checkPostLiked = useCallback(async () => {
    if (!user || !id) return
    try {
      const { data } = await supabase
        .from('post_likes')
        .select('user_id')
        .eq('user_id', user.id)
        .eq('post_id', id)
        .maybeSingle()

      setPostLiked(!!data)
    } catch (err) {
      console.error('检查帖子点赞状态失败:', err)
    }
  }, [user, id])

  // ─── 检查当前用户已点赞的评论 ───
  const checkCommentLikes = useCallback(async () => {
    if (!user || !id) return
    try {
      const { data } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id)

      if (data) {
        setLikedComments(new Set(data.map((row: { comment_id: string }) => row.comment_id)))
      }
    } catch (err) {
      console.error('检查评论点赞状态失败:', err)
    }
  }, [user, id])

  // ─── 初始化加载 ───
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchPost(), fetchComments(), checkPostLiked(), checkCommentLikes()])
      setLoading(false)
    }
    load()
  }, [fetchPost, fetchComments, checkPostLiked, checkCommentLikes])

  // ─── 实时订阅新评论 ───
  useEffect(() => {
    if (!id) return

    const channel = supabase
      .channel(`comments-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${id}`,
        },
        async (payload) => {
          // 获取新评论的完整数据（含 profiles）
          const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            const newComment = data as Comment
            setComments((prev) => {
              // 避免重复添加
              if (prev.some((c) => c.id === newComment.id)) return prev
              return [...prev, newComment]
            })

            // 标记为新评论以触发动画
            setNewCommentIds((prev) => new Set([...prev, newComment.id]))

            // 更新帖子评论数
            setPost((prev) =>
              prev ? { ...prev, comments_count: prev.comments_count + 1 } : prev,
            )

            // 滚动到底部
            setTimeout(() => {
              commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  // ─── 点赞/取消点赞帖子 ───
  const handleTogglePostLike = async () => {
    if (!user || !post) return

    const wasLiked = postLiked
    setPostLiked(!wasLiked)
    setPost((prev) =>
      prev
        ? {
            ...prev,
            likes_count: wasLiked ? Math.max(prev.likes_count - 1, 0) : prev.likes_count + 1,
          }
        : prev,
    )

    try {
      if (wasLiked) {
        await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id)
        await supabase.rpc('decrement_post_likes', { p_post_id: post.id })
        showToast('已取消点赞', 'info')
      } else {
        await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id })
        await supabase.rpc('increment_post_likes', { p_post_id: post.id })
        showToast('点赞成功', 'success')
      }
    } catch (err) {
      console.error('帖子点赞操作失败:', err)
      showToast('操作失败，请重试', 'error')
      // 回滚
      setPostLiked(wasLiked)
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likes_count: wasLiked
                ? prev.likes_count + 1
                : Math.max(prev.likes_count - 1, 0),
            }
          : prev,
      )
    }
  }

  // ─── 点赞/取消点赞评论 ───
  const handleToggleCommentLike = async (commentId: string) => {
    if (!user) return

    const wasLiked = likedComments.has(commentId)
    setLikedComments((prev) => {
      const next = new Set(prev)
      if (wasLiked) next.delete(commentId)
      else next.add(commentId)
      return next
    })
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes_count: wasLiked ? Math.max(c.likes_count - 1, 0) : c.likes_count + 1 }
          : c,
      ),
    )

    try {
      if (wasLiked) {
        await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId)
      } else {
        await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId })
      }
    } catch (err) {
      console.error('评论点赞操作失败:', err)
      showToast('操作失败，请重试', 'error')
      // 回滚
      setLikedComments((prev) => {
        const next = new Set(prev)
        if (wasLiked) next.add(commentId)
        else next.delete(commentId)
        return next
      })
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes_count: wasLiked ? c.likes_count + 1 : Math.max(c.likes_count - 1, 0) }
            : c,
        ),
      )
    }
  }

  // ─── 提交评论 ───
  const handleSubmitComment = async () => {
    if (!user || !id || !commentText.trim() || submitting) return

    const trimmed = commentText.trim()
    setSubmitting(true)

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: id,
        user_id: user.id,
        content: trimmed,
        is_anonymous: true,
      })

      if (error) {
        console.error('发表评论失败:', error)
        showToast('发表评论失败，请重试', 'error')
        return
      }

      // 更新帖子评论数
      await supabase.rpc('increment_post_comments', { p_post_id: id })

      setCommentText('')
      inputRef.current?.blur()
      showToast('评论发表成功', 'success')
    } catch (err) {
      console.error('发表评论异常:', err)
      showToast('发表评论失败，请重试', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── 返回上一页 ───
  const handleBack = () => {
    navigate(-1)
  }

  // ─── 加载中状态 ───
  if (loading) {
    return (
      <div className="detail-page">
        {/* 顶部导航栏骨架 */}
        <header className="nav-bar">
          <div className="nav-content">
            <div className="w-12 h-8 rounded-lg bg-border animate-pulse" />
            <div className="w-20 h-5 rounded-lg bg-border animate-pulse" />
            <div className="w-12 h-8 rounded-lg bg-border animate-pulse" />
          </div>
        </header>

        {/* 帖子骨架 */}
        <div className="content-area">
          <div className="post-card">
            <div className="post-header">
              <div className="post-avatar bg-border animate-pulse" />
              <div className="post-info">
                <div className="h-4 w-24 rounded bg-border animate-pulse" />
                <div className="h-3 w-16 rounded bg-border animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-border animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-border animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-border animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-border animate-pulse" />
            </div>
            <div className="post-actions">
              <div className="h-4 w-16 rounded bg-border animate-pulse" />
              <div className="h-4 w-16 rounded bg-border animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="detail-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4">
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
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-light/50 text-sm mb-4">帖子不存在或已被删除</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="px-6 py-2 rounded-full bg-mint text-white text-sm font-medium shadow-md shadow-mint/30"
        >
          返回首页
        </motion.button>
      </div>
    )
  }

  const postAvatarColor = post.is_anonymous ? '#E6E6FA' : getAvatarColor(post.user_id)
  const postAvatarEmoji = post.is_anonymous ? '👻' : getAvatarEmoji(post.user_id)
  const postNickname = post.is_anonymous
    ? '匿名用户'
    : post.profiles?.nickname || '匿名用户'

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="detail-page"
    >
      {/* ─── 顶部导航栏 ─── */}
      <header className="nav-bar">
        <div className="nav-content">
          {/* 返回按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="back-btn"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm">返回</span>
          </motion.button>

          {/* 标题 */}
          <h1 className="nav-title">树洞详情</h1>

          {/* 占位 */}
          <div className="w-12" />
        </div>
      </header>

      {/* ─── 帖子内容卡片 ─── */}
      <div className="content-area">
        <motion.div
          variants={postCardVariants}
          initial="hidden"
          animate="visible"
          className="post-card"
        >
          {/* 用户信息 */}
          <div className="post-header">
            <div
              className="post-avatar"
              style={{ backgroundColor: postAvatarColor }}
            >
              {postAvatarEmoji}
            </div>
            <div className="post-info">
              <p className="post-author">{postNickname}</p>
              <p className="post-time">{formatTimeAgo(post.created_at)}</p>
            </div>
          </div>

          {/* 标题 */}
          <h2 className="post-title">{post.title}</h2>

          {/* 内容 */}
          <p className="post-body">
            {post.content}
          </p>

          {/* 互动按钮 */}
          <div className="post-actions">
            {/* 点赞按钮 */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleTogglePostLike}
              className={`action-btn${postLiked ? ' liked' : ''}`}
            >
              <motion.svg
                animate={postLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 transition-colors"
                fill={postLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </motion.svg>
              <span className="text-sm transition-colors">
                {post.likes_count || ''}
              </span>
            </motion.button>

            {/* 评论按钮 */}
            <button
              onClick={() => inputRef.current?.focus()}
              className="action-btn"
            >
              <svg
                className="w-5 h-5 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <span className="text-sm transition-colors">
                {post.comments_count || ''}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ─── 评论区标题 ─── */}
        <div id="comments-section" className="comments-section">
          <div className="comments-title">
            <div className="title-bar" />
            <h3>
              评论 ({post.comments_count})
            </h3>
          </div>
        </div>

        {/* ─── 评论列表 ─── */}
        <div className="comments-list">
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div
                key="empty-comments"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="comment-card"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}
              >
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-light/25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                </div>
                <p className="text-light/40 text-sm">还没有评论，来说点什么吧</p>
              </motion.div>
            ) : (
              comments.map((comment, index) => {
                const isNew = newCommentIds.has(comment.id)
                const isCommentLiked = likedComments.has(comment.id)
                const commentAvatarColor = comment.is_anonymous
                  ? '#E6E6FA'
                  : getAvatarColor(comment.user_id)
                const commentAvatarEmoji = comment.is_anonymous
                  ? '👻'
                  : getAvatarEmoji(comment.user_id)
                const commentNickname = comment.is_anonymous
                  ? '匿名用户'
                  : comment.profiles?.nickname || '匿名用户'

                return (
                  <motion.div
                    key={comment.id}
                    custom={isNew ? 0 : index}
                    variants={isNew ? newCommentVariants : commentVariants}
                    initial={isNew ? 'initial' : 'hidden'}
                    animate="animate"
                    exit="exit"
                    layout
                    className="comment-card"
                  >
                    <div className="comment-header">
                      {/* 头像 */}
                      <div
                        className="comment-avatar"
                        style={{ backgroundColor: commentAvatarColor }}
                      >
                        {commentAvatarEmoji}
                      </div>

                      {/* 评论内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="comment-author">{commentNickname}</span>
                          <span className="comment-time">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="comment-body">
                          {comment.content}
                        </p>

                        {/* 评论点赞 */}
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => handleToggleCommentLike(comment.id)}
                          className={`like-btn${isCommentLiked ? ' liked' : ''}`}
                        >
                          <motion.svg
                            animate={isCommentLiked ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className="transition-colors"
                            fill={isCommentLiked ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </motion.svg>
                          {comment.likes_count > 0 && (
                            <span className="text-xs transition-colors">
                              {comment.likes_count}
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>

          {/* 滚动锚点 */}
          <div ref={commentsEndRef} />
        </div>
      </div>

      {/* ─── 底部评论输入栏 ─── */}
      <div className="bottom-bar">
        <div className="bar-content">
          <motion.input
            ref={inputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmitComment()
              }
            }}
            placeholder="写下你的评论..."
            disabled={submitting}
            whileFocus={{ scale: 1.01 }}
            className="comment-input"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || submitting}
            className="send-btn"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              '发送'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
