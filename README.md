# 树洞留言评论系统

一个基于 React + TypeScript + Tailwind CSS + Supabase 的树洞匿名留言评论平台。

## 功能特性

- 📧 邮箱注册/登录
- 📝 匿名发布树洞留言
- 💬 评论互动
- ❤️ 点赞功能
- 🏷️ 分类标签（情感、生活、学习、工作、其他）
- 🎨 卡通风格UI设计
- ✨ 丝滑交互动画

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式方案**: Tailwind CSS v4
- **动画库**: Framer Motion
- **后端服务**: Supabase (Auth + Database + Realtime)
- **路由**: React Router v7

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入你的 Supabase 项目信息：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 配置 Supabase 数据库

在 Supabase SQL Editor 中执行 `supabase/schema.sql` 文件，创建所需的表和函数。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/

## 项目结构

```
treehole-app/
├── src/
│   ├── components/      # 组件
│   │   ├── Toast.tsx           # Toast 通知组件
│   │   └── ToastContext.tsx    # Toast 上下文
│   ├── lib/
│   │   ├── supabase.ts         # Supabase 客户端
│   │   └── utils.ts            # 工具函数
│   ├── pages/
│   │   ├── LoginPage.tsx       # 登录页
│   │   ├── HomePage.tsx        # 主页（树洞列表）
│   │   ├── DetailPage.tsx      # 详情页（留言+评论）
│   │   └── PostPage.tsx        # 发布页
│   ├── types/
│   │   └── index.ts            # TypeScript 类型
│   ├── App.tsx                 # 主应用组件
│   ├── index.css               # 全局样式
│   └── main.tsx                # 入口文件
├── supabase/
│   └── schema.sql              # 数据库Schema
├── .env                        # 环境变量
├── .env.example                # 环境变量模板
├── index.html                  # HTML入口
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript配置
└── vite.config.ts              # Vite配置
```

## 数据库表结构

### posts（树洞帖子）
- id: UUID (主键)
- user_id: UUID (用户ID)
- title: 标题
- content: 内容
- category: 分类
- is_anonymous: 是否匿名
- likes_count: 点赞数
- comments_count: 评论数
- created_at: 创建时间

### comments（评论）
- id: UUID (主键)
- post_id: UUID (帖子ID)
- user_id: UUID (用户ID)
- content: 内容
- is_anonymous: 是否匿名
- likes_count: 点赞数
- created_at: 创建时间

### post_likes / comment_likes（点赞记录）
- user_id + post_id/comment_id (复合主键)

## 设计风格

- **主色调**: 薄荷绿 (#A8E6CF)
- **辅助色**: 淡粉 (#FFB6C1)、奶油黄 (#FFE5B4)、淡紫 (#E6E6FA)、天空蓝 (#87CEEB)
- **字体**: Microsoft YaHei, PingFang SC
- **圆角**: 大量使用圆角设计，营造柔和友好的视觉感受

## 许可证

MIT
