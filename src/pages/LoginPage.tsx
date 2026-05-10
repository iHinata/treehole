import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { useToast } from '../components/ToastContext';
import '../styles/pages/login.less';

/** Floating cloud decoration */
function FloatingCloud({ className, delay = 0, duration = 6 }: { className?: string; delay?: number; duration?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.7, y: [0, -12, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        y: { duration, delay, repeat: Infinity, ease: 'easeInOut' as const },
      }}
    >
      <svg width="100" height="45" viewBox="0 0 120 50" fill="none">
        <ellipse cx="60" cy="35" rx="50" ry="15" fill="white" fillOpacity="0.85" />
        <ellipse cx="40" cy="28" rx="28" ry="18" fill="white" fillOpacity="0.85" />
        <ellipse cx="75" cy="25" rx="30" ry="20" fill="white" fillOpacity="0.85" />
        <ellipse cx="55" cy="20" rx="22" ry="16" fill="white" fillOpacity="0.9" />
      </svg>
    </motion.div>
  );
}

/** Cute sun character with blushing cheeks */
function SunCharacter() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
        {/* Sun rays */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
          style={{ transformOrigin: '90px 90px' }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx="90"
              cy="20"
              rx="8"
              ry="16"
              fill="#FFD93D"
              transform={`rotate(${i * 45} 90 90)`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.g>

        {/* Main sun body */}
        <circle cx="90" cy="90" r="55" fill="#FFD93D" />
        <circle cx="90" cy="90" r="50" fill="#FFE066" />

        {/* Blush cheeks */}
        <ellipse cx="55" cy="100" rx="12" ry="8" fill="#FFB6C1" fillOpacity="0.6" />
        <ellipse cx="125" cy="100" rx="12" ry="8" fill="#FFB6C1" fillOpacity="0.6" />

        {/* Eyes - blinking animation */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const, times: [0, 0.45, 0.5, 0.55, 1] }}
        >
          <ellipse cx="70" cy="85" rx="6" ry="8" fill="#4A4A4A" />
          <ellipse cx="110" cy="85" rx="6" ry="8" fill="#4A4A4A" />
        </motion.g>

        {/* Eye highlights */}
        <circle cx="72" cy="82" r="2.5" fill="white" />
        <circle cx="112" cy="82" r="2.5" fill="white" />

        {/* Happy smile */}
        <path d="M70 105 Q90 125 110 105" stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Small sparkle decorations */}
        <motion.circle cx="35" cy="50" r="3" fill="white"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle cx="145" cy="55" r="2.5" fill="white"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.circle cx="50" cy="140" r="2" fill="white"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </svg>
    </motion.div>
  );
}

/** Small tree icon for card decoration */
function SmallTreeIcon() {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      <rect x="13" y="26" width="6" height="12" rx="2" fill="#8B6F47" />
      <circle cx="16" cy="18" r="14" fill="#6BCB77" />
      <circle cx="10" cy="20" r="9" fill="#5AB868" />
      <circle cx="22" cy="20" r="9" fill="#5AB868" />
      <circle cx="16" cy="12" r="10" fill="#7ED882" />
    </svg>
  );
}

/** Mail icon */
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/** Lock icon */
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/** 将 Supabase 错误信息翻译成中文 */
function translateError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '邮箱未验证，请查收验证邮件',
    'User already registered': '该邮箱已被注册',
    'Password should be at least 6 characters': '密码至少需要6个字符',
    'Unable to validate email address: invalid format': '邮箱格式不正确',
    'Signups not allowed': '暂不允许注册',
    'Email rate limit exceeded': '邮件发送过于频繁，请稍后再试',
    'Invalid email': '邮箱格式不正确',
    'User not found': '用户不存在',
    'Invalid password': '密码错误',
    'New password should be different from the old password': '新密码不能与旧密码相同',
    'is invalid': '该邮箱地址无效，请使用真实邮箱',
    'Email address': '邮箱地址无效',
  };

  // 尝试匹配已知错误
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 默认返回原信息或通用提示
  return message || '操作失败，请稍后重试';
}

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, session } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 登录成功后的跳转在 handleSubmit 中处理

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      const msg = '请填写邮箱和密码';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const msg = '请输入有效的邮箱地址';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      const msg = '两次输入的密码不一致';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (password.length < 6) {
      const msg = '密码至少需要6个字符';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      const { error: errMsg } = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (errMsg) {
        const translatedError = translateError(errMsg);
        setError(translatedError);
        showToast(translatedError, 'error');
      } else if (isSignUp) {
        setError('');
        showToast('注册成功！请查收邮箱验证链接', 'success');
        setIsSignUp(false);
      } else {
        showToast('登录成功！', 'success');
        // 登录成功后跳转到首页
        setTimeout(() => {
          navigate('/');
        }, 800);
      }
    } catch {
      const msg = '操作失败，请稍后重试';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setConfirmPassword('');
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== Left Side - Branding ===== */}
      <motion.div
        className="brand-panel"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
      >
        {/* Clouds */}
        <FloatingCloud className="top-[5%] left-[3%]" delay={0.2} duration={7} />
        <FloatingCloud className="top-[12%] right-[5%]" delay={0.8} duration={8} />
        <FloatingCloud className="bottom-[15%] left-[8%]" delay={1.2} duration={6} />
        <FloatingCloud className="bottom-[25%] right-[3%]" delay={0.5} duration={9} />
        <FloatingCloud className="top-[40%] left-[0%]" delay={1.5} duration={7.5} />
        <FloatingCloud className="top-[60%] right-[0%]" delay={0.3} duration={6.5} />

        <motion.div
          className="brand-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Main title - very large */}
          <motion.h1
            className="brand-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            树洞
          </motion.h1>

          {/* Subtitle - smaller, lighter */}
          <motion.p
            className="brand-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Tree Hole
          </motion.p>

          {/* Sun character */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.9, type: 'spring', stiffness: 150 }}
          >
            <SunCharacter />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="brand-tagline"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            说出你的秘密，找到懂你的人
          </motion.p>
        </motion.div>

        {/* Bottom decorations */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <div className="deco-circle circle-1" />
          <div className="deco-circle circle-2" />
          <div className="deco-circle circle-3" />
        </div>
      </motion.div>

      {/* ===== Right Side - Login Form ===== */}
      <motion.div
        className="form-panel"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.1 }}
      >
        {/* Background pattern - more visible */}
        <div className="bg-pattern" />
        {/* Decorative circles - more visible */}
        <div className="deco deco-1" />
        <div className="deco deco-2" />
        <div className="deco deco-3" />
        <div className="deco deco-4" />
        <motion.div
          className="login-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Small tree icon decoration */}
          <div className="absolute -top-4 -right-4 opacity-20">
            <SmallTreeIcon />
          </div>

          {/* Mobile-only branding */}
          <motion.div
            className="mobile-branding"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: 'spring' }}
          >
            <h1 className="mobile-title">树洞</h1>
            <p className="mobile-subtitle">Tree Hole</p>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="form-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {isSignUp ? '创建账号' : '欢迎回来'}
          </motion.h2>

          <motion.p
            className="form-subtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {isSignUp ? '注册以开始你的树洞之旅' : '登录以继续探索树洞世界'}
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="input-group">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="input-group">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Confirm Password (sign up only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="input-group">
                    <span className="input-icon">
                      <LockIcon />
                    </span>
                    <input
                      type="password"
                      placeholder="请再次输入密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="error-msg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="submit-btn"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(168, 230, 207, 0.45)' }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isSignUp ? '注册' : '登录'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            className="divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="divider-line" />
            <span className="divider-text">或</span>
            <div className="divider-line" />
          </motion.div>

          {/* Other login methods hint */}
          <motion.p
            className="other-login-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.05 }}
          >
            暂不支持其他登录方式
          </motion.p>

          {/* Toggle sign up / sign in */}
          <motion.p
            className="toggle-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            {isSignUp ? '已有账号？' : '还没有账号？'}
            <button
              onClick={toggleMode}
              className="toggle-link"
            >
              {isSignUp ? '立即登录' : '立即注册'}
            </button>
          </motion.p>

          {/* Privacy policy */}
          <motion.p
            className="privacy-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {isSignUp ? '注册' : '登录'}即表示同意
            <a href="/terms">《用户协议》</a>
            {' '}和{' '}
            <a href="/privacy">《隐私政策》</a>
          </motion.p>

          {/* Decorative dots */}
          <motion.div
            className="deco-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <div className="dot dot-1" />
            <div className="dot dot-2" />
            <div className="dot dot-3" />
            <div className="dot dot-4" />
            <div className="dot dot-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
