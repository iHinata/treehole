# 树洞 App 设计规范文档 (Design Specification)

> 版本: 1.0.0
> 最后更新: 2026-05-09
> 设计风格: 卡通风格 (Cartoon Style)
> 适用平台: Web (移动端优先)

---

## 1. 设计规范总览

树洞 (Tree Hole) 是一款匿名社交应用，采用清新卡通风格设计语言，旨在为用户提供一个安全、温暖的倾诉空间。整体设计以薄荷绿为主色调，搭配柔和的粉色、薰衣草紫、天蓝、奶油色和蜜桃色作为辅助色，营造出轻松、治愈的视觉氛围。

### 设计原则

| 原则 | 说明 |
|------|------|
| **温暖治愈** | 柔和的配色与圆润的形状，传递安全感与亲切感 |
| **简洁直觉** | 清晰的信息层级与操作路径，降低用户认知负担 |
| **匿名安全** | 通过匿名头像、虚拟昵称等设计元素保护用户隐私 |
| **趣味互动** | 卡通风格插画与微动效，增加使用愉悦感 |
| **一致性** | 统一的组件规范与交互模式，确保体验连贯 |

### 设计关键词

- 柔和 (Soft)
- 圆润 (Rounded)
- 治愈 (Healing)
- 轻松 (Relaxed)
- 安全 (Safe)

---

## 2. 色彩系统 (Color System)

### 2.1 主色 (Primary)

| 名称 | 色值 | 预览 | 用途 |
|------|------|------|------|
| Mint Green (薄荷绿) | `#A8E6CF` | ![#A8E6CF](https://via.placeholder.com/20/A8E6CF/A8E6CF) | 品牌主色、登录页背景、主要按钮、强调元素 |

### 2.2 辅助色 (Secondary)

| 名称 | 色值 | 预览 | 用途 |
|------|------|------|------|
| Soft Pink (柔粉) | `#FFB6C1` | ![#FFB6C1](https://via.placeholder.com/20/FFB6C1/FFB6C1) | 分类标签、心情标记、装饰元素 |
| Lavender (薰衣草紫) | `#E6E6FA` | ![#E6E6FA](https://via.placeholder.com/20/E6E6FA/E6E6FA) | 分类标签、背景装饰、渐变过渡 |
| Sky Blue (天蓝) | `#87CEEB` | ![#87CEEB](https://via.placeholder.com/20/87CEEB/87CEEB) | 分类标签、链接、信息提示 |
| Cream (奶油色) | `#FFE5B4` | ![#FFE5B4](https://via.placeholder.com/20/FFE5B4/FFE5B4) | 分类标签、背景点缀、高亮区域 |
| Peach (蜜桃色) | `#FFDAB9` | ![#FFDAB9](https://via.placeholder.com/20/FFDAB9/FFDAB9) | 分类标签、暖色调装饰、渐变过渡 |

### 2.3 功能色 (Functional Colors)

| 名称 | 色值 | 用途 |
|------|------|------|
| WeChat Green (微信绿) | `#07C160` | 微信登录按钮、微信相关功能 |
| Accent Blue (强调蓝) | `#6C9BCF` | 链接、可点击元素、信息类提示 |

### 2.4 中性色 (Neutral Colors)

| 名称 | 色值 | 用途 |
|------|------|------|
| Background (背景色) | `#F5F5F5` | 页面主背景 |
| Card (卡片色) | `#FFFFFF` | 卡片、弹窗、输入框背景 |
| Text Dark (深色文字) | `#4A4A4A` | 标题、正文主要内容 |
| Text Light (浅色文字) | `#7A7A7A` | 副标题、辅助说明文字、时间戳 |
| Border (边框色) | `#E8E8E8` | 分割线、输入框边框、卡片边框 |

### 2.5 色彩使用规则

1. **主色占比**: 页面中薄荷绿占比不超过 30%，避免视觉疲劳
2. **辅助色搭配**: 辅助色之间可自由搭配，但单页面中辅助色种类不超过 3 种
3. **中性色层级**: 文字颜色严格遵循深色/浅色两级，不使用纯黑 `#000000`
4. **背景层次**: 背景色与卡片色之间保持足够的对比度，确保内容可读性

---

## 3. 字体规范 (Typography)

### 3.1 字体族 (Font Family)

```css
font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

| 优先级 | 字体 | 适用平台 |
|--------|------|----------|
| 1 | Microsoft YaHei (微软雅黑) | Windows |
| 2 | PingFang SC (苹方) | macOS / iOS |
| 3 | -apple-system | Apple 系统回退 |
| 4 | sans-serif | 通用回退 |

### 3.2 字号层级 (Font Size Scale)

| 层级 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| h1 | 36px | Bold (700) | 1.3 | 页面主标题（如登录页"树洞"） |
| h2 | 24px | Bold (700) | 1.4 | 区块标题、弹窗标题 |
| h3 | 18px | Bold (700) | 1.4 | 卡片标题、列表标题 |
| body | 14px | Regular (400) | 1.6 | 正文内容、描述文字 |
| caption | 12px | Regular (400) | 1.5 | 辅助说明、时间戳、标签文字 |
| small | 10px | Regular (400) | 1.4 | 极小标注、版权信息 |

### 3.3 字体使用规则

1. **标题字重**: 所有标题层级统一使用 `Bold (700)`，保持视觉层级清晰
2. **正文字重**: 正文使用 `Regular (400)`，需要强调时可使用 `Medium (500)`
3. **行高**: 标题行高较紧凑 (1.3-1.4)，正文行高较宽松 (1.5-1.6)，提升可读性
4. **字间距**: 默认使用 `normal`，标题可适当使用 `0.5px` 增加呼吸感
5. **最大宽度**: 正文内容最大宽度不超过 680px，确保阅读舒适度

---

## 4. 间距系统 (Spacing)

### 4.1 基础单位

基础间距单位为 **4px**，所有间距值为 4px 的整数倍。

### 4.2 间距刻度

| Token | 值 | 常见用途 |
|-------|------|----------|
| `space-1` | 4px | 图标与文字间距、极小间距 |
| `space-2` | 8px | 紧凑元素间距、标签内边距 |
| `space-3` | 12px | 相关元素间距、列表项间距 |
| `space-4` | 16px | 卡片内边距、标准元素间距 |
| `space-5` | 20px | 卡片内边距、区块间距 |
| `space-6` | 24px | 大区块间距、页面边距 |
| `space-8` | 32px | 区块分隔间距 |
| `space-10` | 40px | 大区块分隔 |
| `space-12` | 48px | 页面级间距 |
| `space-16` | 64px | 页面顶部/底部留白 |

### 4.3 间距使用规则

1. **页面水平边距**: 移动端统一使用 `24px`，桌面端使用 `auto` 居中 + `max-width`
2. **卡片内边距**: 标准卡片 `20px`，大卡片 `24px`，小卡片 `16px`
3. **元素间距**: 同类元素之间使用 `16px`，不同类元素之间使用 `24px`
4. **列表间距**: 列表项之间使用 `12px` 或 `16px`

---

## 5. 圆角规范 (Border Radius)

### 5.1 圆角刻度

| 级别 | 值 | Token | 用途 |
|------|------|-------|------|
| Small (小圆角) | 8px | `radius-sm` | 输入框、标签 (Tags)、小型按钮 |
| Medium (中圆角) | 12px | `radius-md` | 卡片、按钮、搜索栏、评论卡片 |
| Large (大圆角) | 16px | `radius-lg` | 弹窗、大卡片、登录卡片、帖子卡片 |
| XLarge (超大圆角) | 24px | `radius-xl` | 登录卡片、特殊装饰元素 |
| Full (全圆角) | 9999px | `radius-full` | 头像、药丸形按钮 (Pills)、分类标签 |

### 5.2 圆角使用规则

1. **卡通风格**: 整体偏向大圆角，营造柔和亲切的视觉感受
2. **层级关系**: 容器圆角 > 内容圆角，外层元素圆角应大于或等于内层元素
3. **一致性**: 同类组件使用相同圆角值，保持视觉统一

---

## 6. 阴影规范 (Shadows)

### 6.1 阴影层级

| 级别 | 值 | 用途 |
|------|------|------|
| Card (卡片阴影) | `0 2px 8px rgba(0, 0, 0, 0.06)` | 帖子卡片、评论卡片、菜单项 |
| Button (按钮阴影) | `0 4px 12px rgba(0, 0, 0, 0.1)` | 主要操作按钮、悬浮按钮 |
| Modal (弹窗阴影) | `0 8px 32px rgba(0, 0, 0, 0.12)` | 弹窗、抽屉、浮层 |

### 6.2 阴影使用规则

1. **浅色阴影**: 卡通风格偏好轻柔阴影，避免过于浓重的投影效果
2. **单层阴影**: 不使用多层阴影叠加，保持画面干净
3. **悬浮状态**: 卡片/按钮悬浮时可提升一个阴影层级
4. **背景适配**: 在浅色背景上使用标准阴影，在白色背景上可适当加深

---

## 7. 组件规范 (Component Specs)

### 7.1 登录页 (Login Page)

#### 布局结构

```
+--------------------------------------------------+
|                    |                              |
|    左侧面板        |         右侧面板              |
|    (50% 宽度)      |         (50% 宽度)            |
|                    |                              |
|   背景: #A8E6CF   |      背景: #F5F5F5           |
|                    |                              |
|   "树洞"           |      [登录卡片]               |
|   72px Bold        |      max-width: 480px        |
|                    |      padding: 48px            |
|   副标题 24px      |      border-radius: 24px      |
|   标语 18px        |      background: #FFFFFF      |
|                    |      shadow: Modal            |
|                    |                              |
|                    |      [输入框 x2]              |
|                    |      height: 56px             |
|                    |      border-radius: 16px      |
|                    |      padding: 16px            |
|                    |                              |
|                    |      [登录按钮]               |
|                    |      height: 56px             |
|                    |      border-radius: 16px      |
|                    |      font-size: 18px          |
|                    |                              |
+--------------------------------------------------+
```

#### 详细规格

| 元素 | 属性 | 值 |
|------|------|------|
| **页面布局** | display | flex, 左右分屏 |
| **左侧面板** | width | 50% |
| **左侧背景** | background | `#A8E6CF` (薄荷绿) |
| **左侧标题** | font-size | 72px |
| **左侧标题** | font-weight | Bold (700) |
| **左侧标题** | color | `#FFFFFF` |
| **左侧副标题** | font-size | 24px |
| **左侧标语** | font-size | 18px |
| **右侧面板** | width | 50% |
| **右侧背景** | background | `#F5F5F5` |
| **登录卡片** | max-width | 480px |
| **登录卡片** | padding | 48px |
| **登录卡片** | border-radius | 24px |
| **登录卡片** | background | `#FFFFFF` |
| **登录卡片** | box-shadow | `0 8px 32px rgba(0,0,0,0.12)` |
| **输入框** | height | 56px |
| **输入框** | border-radius | 16px |
| **输入框** | padding | 16px |
| **输入框** | border | 1px solid `#E8E8E8` |
| **输入框** | font-size | 16px |
| **输入框** | background | `#F5F5F5` |
| **登录按钮** | height | 56px |
| **登录按钮** | border-radius | 16px |
| **登录按钮** | font-size | 18px |
| **登录按钮** | font-weight | Bold (700) |
| **登录按钮** | background | `#A8E6CF` |
| **登录按钮** | color | `#FFFFFF` |
| **微信登录按钮** | background | `#07C160` |

#### 响应式适配

- **平板 (<=1024px)**: 左侧面板宽度缩至 40%，右侧面板 60%
- **手机 (<=768px)**: 取消分屏，左侧面板隐藏，右侧面板占满全屏，登录卡片居中

---

### 7.2 主页 (Home Page)

#### 布局结构

```
+------------------------------------------+
|  [顶部导航栏]  height: 64px              |
|  padding: 0 24px                         |
|  [Logo]        [搜索栏]       [通知图标]  |
+------------------------------------------+
|  [搜索栏]  height: 44px                  |
|  border-radius: 12px                     |
|  background: #F5F5F5                     |
+------------------------------------------+
|  [分类标签]  height: 40px, gap: 12px     |
|  border-radius: 20px                     |
|  [全部] [情感] [吐槽] [秘密] [求助] ...   |
+------------------------------------------+
|                                          |
|  [帖子卡片]  padding: 20px               |
|  border-radius: 16px                     |
|  gap: 16px                               |
|  +--------------------------------------+|
|  | [匿名头像] 40x40  [匿名用户] [时间]   ||
|  | [帖子标题] h3 18px Bold              ||
|  | [帖子内容] body 14px                 ||
|  | [标签] [点赞] [评论]                  ||
|  +--------------------------------------+|
|                                          |
|  [帖子卡片] ...                          |
|                                          |
+------------------------------------------+
|  [底部导航栏]  height: 64px              |
|  [首页] [发布] [我的]                     |
+------------------------------------------+
```

#### 详细规格

| 元素 | 属性 | 值 |
|------|------|------|
| **顶部导航** | height | 64px |
| **顶部导航** | padding | 0 24px |
| **顶部导航** | background | `#FFFFFF` |
| **顶部导航** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **搜索栏** | height | 44px |
| **搜索栏** | border-radius | 12px |
| **搜索栏** | background | `#F5F5F5` |
| **搜索栏** | padding | 0 16px |
| **搜索栏** | font-size | 14px |
| **搜索栏** | placeholder color | `#7A7A7A` |
| **分类标签** | height | 40px |
| **分类标签** | gap | 12px |
| **分类标签** | border-radius | 20px |
| **分类标签** | padding | 0 20px |
| **分类标签** | font-size | 14px |
| **分类标签** | active background | `#A8E6CF` |
| **分类标签** | active color | `#FFFFFF` |
| **分类标签** | inactive background | `#F5F5F5` |
| **分类标签** | inactive color | `#4A4A4A` |
| **帖子卡片** | padding | 20px |
| **帖子卡片** | border-radius | 16px |
| **帖子卡片** | gap | 16px |
| **帖子卡片** | background | `#FFFFFF` |
| **帖子卡片** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **帖子卡片** | margin-bottom | 16px |
| **匿名头像** | size | 40x40px |
| **匿名头像** | border-radius | 50% (Full) |
| **匿名用户名** | font-size | 14px |
| **匿名用户名** | font-weight | Medium (500) |
| **匿名用户名** | color | `#4A4A4A` |
| **时间戳** | font-size | 12px |
| **时间戳** | color | `#7A7A7A` |
| **帖子标题** | font-size | 18px |
| **帖子标题** | font-weight | Bold (700) |
| **帖子标题** | color | `#4A4A4A` |
| **帖子内容** | font-size | 14px |
| **帖子内容** | color | `#4A4A4A` |
| **帖子内容** | line-height | 1.6 |
| **帖子内容** | max-lines | 3 (超出显示"展开") |
| **底部导航** | height | 64px |
| **底部导航** | background | `#FFFFFF` |
| **底部导航** | box-shadow | `0 -2px 8px rgba(0,0,0,0.06)` |
| **底部导航图标** | size | 24px |
| **底部导航文字** | font-size | 10px |
| **底部导航 active** | color | `#A8E6CF` |
| **底部导航 inactive** | color | `#7A7A7A` |

---

### 7.3 详情页 (Detail Page)

#### 布局结构

```
+------------------------------------------+
|  [返回按钮]        [详情页标题]  [更多]    |
+------------------------------------------+
|                                          |
|  [帖子卡片]  padding: 24px               |
|  border-radius: 16px                     |
|  +--------------------------------------+|
|  | [匿名头像]  [匿名用户] [时间] [分类]  ||
|  | [帖子标题] h2 24px Bold              ||
|  | [帖子内容] body 14px (完整显示)       ||
|  | [图片区域] (如有)                     ||
|  | [点赞] [评论数] [分享]                ||
|  +--------------------------------------+|
|                                          |
|  [评论区标题] "评论 (n)"                 |
|                                          |
|  [评论卡片]  padding: 16px               |
|  border-radius: 12px                     |
|  gap: 12px                               |
|  +--------------------------------------+|
|  | [匿名头像]  [匿名用户] [时间]         ||
|  | [评论内容] body 14px                 ||
|  | [点赞] [回复]                         ||
|  +--------------------------------------+|
|                                          |
|  [评论卡片] ...                          |
|                                          |
+------------------------------------------+
|  [评论输入栏]  height: 64px              |
|  [输入框] height: 44px  [发送按钮]       |
|  发送按钮: width 80px, height 44px       |
+------------------------------------------+
```

#### 详细规格

| 元素 | 属性 | 值 |
|------|------|------|
| **帖子卡片** | padding | 24px |
| **帖子卡片** | border-radius | 16px |
| **帖子卡片** | background | `#FFFFFF` |
| **帖子卡片** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **帖子标题** | font-size | 24px (h2) |
| **帖子标题** | font-weight | Bold (700) |
| **帖子内容** | font-size | 14px |
| **帖子内容** | line-height | 1.8 |
| **评论区标题** | font-size | 18px (h3) |
| **评论区标题** | font-weight | Bold (700) |
| **评论区标题** | color | `#4A4A4A` |
| **评论卡片** | padding | 16px |
| **评论卡片** | border-radius | 12px |
| **评论卡片** | gap | 12px |
| **评论卡片** | background | `#FFFFFF` |
| **评论卡片** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **评论内容** | font-size | 14px |
| **评论内容** | color | `#4A4A4A` |
| **评论输入栏** | height | 64px |
| **评论输入栏** | background | `#FFFFFF` |
| **评论输入栏** | box-shadow | `0 -2px 8px rgba(0,0,0,0.06)` |
| **评论输入框** | height | 44px |
| **评论输入框** | border-radius | 12px |
| **评论输入框** | background | `#F5F5F5` |
| **评论输入框** | padding | 0 16px |
| **评论输入框** | font-size | 14px |
| **发送按钮** | width | 80px |
| **发送按钮** | height | 44px |
| **发送按钮** | border-radius | 12px |
| **发送按钮** | background | `#A8E6CF` |
| **发送按钮** | color | `#FFFFFF` |
| **发送按钮** | font-size | 14px |
| **发送按钮** | font-weight | Medium (500) |

---

### 7.4 发布页 (Post Page)

#### 布局结构

```
+------------------------------------------+
|  [取消]           发布树洞        [发布]  |
+------------------------------------------+
|                                          |
|  [表单卡片]  padding: 24px               |
|  border-radius: 16px                     |
|  +--------------------------------------+|
|  | [标题输入框]                          ||
|  | height: 48px, border-radius: 12px    ||
|  | placeholder: "给树洞起个标题..."       ||
|  +--------------------------------------+|
|  | [内容输入框]                          ||
|  | min-height: 200px, border-radius: 12px||
|  | placeholder: "说出你的心里话..."       ||
|  +--------------------------------------+|
|  | [分类选择]                            ||
|  | 药丸标签, height: 40px               ||
|  | border-radius: 20px, gap: 12px       ||
|  | [情感] [吐槽] [秘密] [求助] [日常]    ||
|  +--------------------------------------+|
|  | [匿名开关]                            ||
|  | width: 48px, height: 28px            ||
|  | border-radius: 14px                  ||
|  | "匿名发布" label                     ||
|  +--------------------------------------+|
|  | [图片上传区域]                        ||
|  | dashed border, border-radius: 12px   ||
|  +--------------------------------------+|
+------------------------------------------+
```

#### 详细规格

| 元素 | 属性 | 值 |
|------|------|------|
| **表单卡片** | padding | 24px |
| **表单卡片** | border-radius | 16px |
| **表单卡片** | background | `#FFFFFF` |
| **表单卡片** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **标题输入框** | height | 48px |
| **标题输入框** | border-radius | 12px |
| **标题输入框** | border | 1px solid `#E8E8E8` |
| **标题输入框** | padding | 0 16px |
| **标题输入框** | font-size | 16px |
| **标题输入框** | placeholder | "给树洞起个标题..." |
| **内容输入框** | min-height | 200px |
| **内容输入框** | border-radius | 12px |
| **内容输入框** | border | 1px solid `#E8E8E8` |
| **内容输入框** | padding | 16px |
| **内容输入框** | font-size | 14px |
| **内容输入框** | line-height | 1.6 |
| **内容输入框** | placeholder | "说出你的心里话..." |
| **分类标签** | height | 40px |
| **分类标签** | border-radius | 20px |
| **分类标签** | gap | 12px |
| **分类标签** | padding | 0 20px |
| **分类标签** | font-size | 14px |
| **分类标签** | border | 1px solid `#E8E8E8` |
| **分类标签** | selected background | `#A8E6CF` |
| **分类标签** | selected color | `#FFFFFF` |
| **分类标签** | selected border | `#A8E6CF` |
| **匿名开关** | width | 48px |
| **匿名开关** | height | 28px |
| **匿名开关** | border-radius | 14px |
| **匿名开关** | on background | `#A8E6CF` |
| **匿名开关** | off background | `#E8E8E8` |
| **匿名开关** | thumb size | 22px |
| **匿名开关** | label font-size | 14px |
| **图片上传区域** | border-radius | 12px |
| **图片上传区域** | border | 2px dashed `#E8E8E8` |
| **图片上传区域** | min-height | 120px |
| **发布按钮** | height | 48px |
| **发布按钮** | border-radius | 12px |
| **发布按钮** | background | `#A8E6CF` |
| **发布按钮** | color | `#FFFFFF` |
| **发布按钮** | font-size | 16px |
| **发布按钮** | font-weight | Bold (700) |

---

### 7.5 我的页面 (Profile Page)

#### 布局结构

```
+------------------------------------------+
|  [个人中心]                               |
+------------------------------------------+
|  [个人资料头部]  height: 200px            |
|  background: 渐变 (#A8E6CF -> #87CEEB)   |
|  +--------------------------------------+|
|  |        [匿名头像] 80x80px             ||
|  |        [匿名用户名] 18px Bold         ||
|  |        [个人简介] 14px                ||
|  +--------------------------------------+|
|                                          |
|  [数据统计]  3 columns, gap: 16px        |
|  +--------+--------+--------+           |
|  | 发布数 | 获赞数 | 评论数 |           |
|  |  12    |  86    |  34    |           |
|  +--------+--------+--------+           |
|                                          |
|  [菜单列表]                              |
|  +--------------------------------------+|
|  | [图标] 我的帖子        height: 56px  ||
|  |        border-radius: 12px           ||
|  +--------------------------------------+|
|  | [图标] 我的收藏        height: 56px  ||
|  |        border-radius: 12px           ||
|  +--------------------------------------+|
|  | [图标] 消息通知        height: 56px  ||
|  |        border-radius: 12px           ||
|  +--------------------------------------+|
|  | [图标] 隐私设置        height: 56px  ||
|  |        border-radius: 12px           ||
|  +--------------------------------------+|
|  | [图标] 关于我们        height: 56px  ||
|  |        border-radius: 12px           ||
|  +--------------------------------------+|
|  | [图标] 退出登录        height: 56px  ||
|  |        color: #FF6B6B               ||
|  +--------------------------------------+|
+------------------------------------------+
```

#### 详细规格

| 元素 | 属性 | 值 |
|------|------|------|
| **页面标题** | font-size | 24px (h2) |
| **页面标题** | font-weight | Bold (700) |
| **页面标题** | text-align | center |
| **资料头部** | height | 200px |
| **资料头部** | background | linear-gradient(135deg, `#A8E6CF`, `#87CEEB`) |
| **资料头部** | border-radius | 0 0 24px 24px |
| **资料头部** | display | flex, column, align-center |
| **头像** | size | 80x80px |
| **头像** | border-radius | 50% (Full) |
| **头像** | border | 3px solid `#FFFFFF` |
| **头像** | box-shadow | `0 4px 12px rgba(0,0,0,0.1)` |
| **用户名** | font-size | 18px (h3) |
| **用户名** | font-weight | Bold (700) |
| **用户名** | color | `#FFFFFF` |
| **个人简介** | font-size | 14px |
| **个人简介** | color | `rgba(255,255,255,0.85)` |
| **数据统计区** | columns | 3 |
| **数据统计区** | gap | 16px |
| **数据统计区** | padding | 24px |
| **统计数字** | font-size | 24px |
| **统计数字** | font-weight | Bold (700) |
| **统计数字** | color | `#4A4A4A` |
| **统计标签** | font-size | 12px |
| **统计标签** | color | `#7A7A7A` |
| **菜单项** | height | 56px |
| **菜单项** | border-radius | 12px |
| **菜单项** | padding | 0 20px |
| **菜单项** | background | `#FFFFFF` |
| **菜单项** | box-shadow | `0 2px 8px rgba(0,0,0,0.06)` |
| **菜单项** | margin-bottom | 12px |
| **菜单图标** | size | 24px |
| **菜单文字** | font-size | 16px |
| **菜单文字** | color | `#4A4A4A` |
| **退出登录文字** | color | `#FF6B6B` |
| **菜单箭头** | color | `#7A7A7A` |

---

## 8. 动画规范 (Animation)

### 8.1 页面转场 (Page Transition)

```css
/* 页面进入动画 */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-out;
}

/* 页面退出动画 */
.page-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateY(20px);
  transition: all 300ms ease-in;
}
```

| 属性 | 值 |
|------|------|
| 效果 | 淡入 + 上滑 |
| 持续时间 | 300ms |
| 位移距离 | 20px (向上) |
| 缓动函数 | ease-out (进入) / ease-in (退出) |

### 8.2 卡片入场动画 (Card Entrance)

```css
.card-enter {
  opacity: 0;
  transform: translateY(16px);
}

.card-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 400ms ease-out;
}
```

| 属性 | 值 |
|------|------|
| 效果 | 交错淡入上滑 |
| 每张卡片延迟 | 60ms |
| 持续时间 | 400ms |
| 位移距离 | 16px |
| 缓动函数 | ease-out |

**示例**: 3 张卡片的延迟分别为 0ms、60ms、120ms

### 8.3 按钮交互动画 (Button Interaction)

#### Hover (悬浮)

```css
.button-hover {
  transform: scale(1.02);
  transition: transform 200ms ease-out;
}
```

| 属性 | 值 |
|------|------|
| 效果 | 微放大 |
| 缩放比例 | 1.02 |
| 持续时间 | 200ms |
| 缓动函数 | ease-out |

#### Tap/Active (点击)

```css
.button-active {
  transform: scale(0.98);
  transition: transform 100ms ease-in;
}
```

| 属性 | 值 |
|------|------|
| 效果 | 微缩小 |
| 缩放比例 | 0.98 |
| 持续时间 | 100ms |
| 缓动函数 | ease-in |

### 8.4 Toast 提示动画 (Toast Notification)

```css
.toast-enter {
  opacity: 0;
  transform: translateY(-100%);
}

.toast-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-exit-active {
  opacity: 0;
  transform: translateY(-100%);
  transition: all 200ms ease-in;
}
```

| 属性 | 值 |
|------|------|
| 效果 | 从顶部滑入 |
| 持续时间 | 300ms (进入) / 200ms (退出) |
| 缓动函数 | cubic-bezier(0.34, 1.56, 0.64, 1) (弹簧效果) |
| 退出效果 | 向上滑出 + 淡出 |

### 8.5 其他动画

| 动画名称 | 持续时间 | 缓动函数 | 说明 |
|----------|----------|----------|------|
| 骨架屏闪烁 | 1.5s | ease-in-out | `opacity: 0.3 <-> 0.6` 循环 |
| 点赞心跳 | 400ms | ease-out | `scale(1) -> scale(1.3) -> scale(1)` |
| 开关切换 | 300ms | ease-in-out | 背景色 + 滑块位置过渡 |
| 标签选中 | 200ms | ease-out | 背景色 + 文字色过渡 |
| 图片加载 | 300ms | ease-out | 淡入显示 |
| 下拉刷新 | 400ms | ease-in-out | 旋转加载指示器 |
| 模态弹窗 | 250ms | cubic-bezier(0.34, 1.56, 0.64, 1) | 缩放 + 淡入 |
| 遮罩层 | 250ms | ease-out | 淡入 |

### 8.6 动画使用原则

1. **克制使用**: 动画服务于功能，不为了动而动
2. **性能优先**: 仅对 `transform` 和 `opacity` 做动画，避免触发重排 (reflow)
3. **尊重偏好**: 支持 `prefers-reduced-motion` 媒体查询，为敏感用户关闭动画
4. **时长一致**: 同类动画保持相同时长，建立用户预期
5. **卡通风格**: 适当使用弹性缓动 (spring easing)，增加趣味感

```css
/* 尊重用户动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 附录

### A. CSS 自定义属性参考 (CSS Custom Properties)

```css
:root {
  /* 色彩 */
  --color-primary: #A8E6CF;
  --color-secondary-pink: #FFB6C1;
  --color-secondary-lavender: #E6E6FA;
  --color-secondary-sky: #87CEEB;
  --color-secondary-cream: #FFE5B4;
  --color-secondary-peach: #FFDAB9;
  --color-wechat: #07C160;
  --color-accent-blue: #6C9BCF;
  --color-bg: #F5F5F5;
  --color-card: #FFFFFF;
  --color-text-dark: #4A4A4A;
  --color-text-light: #7A7A7A;
  --color-border: #E8E8E8;

  /* 字体 */
  --font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-h1: 36px;
  --font-size-h2: 24px;
  --font-size-h3: 18px;
  --font-size-body: 14px;
  --font-size-caption: 12px;
  --font-size-small: 10px;

  /* 间距 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* 阴影 */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-button: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.12);

  /* 动画 */
  --transition-fast: 100ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### B. 设计工具配置

设计稿中请使用以下配置以确保与开发一致:

- **Figma / Sketch**: 基础网格 4px，字体按上述规范设置
- **颜色命名**: 使用上述 CSS 变量名作为设计 Token 名称
- **组件库**: 所有组件按本规范创建，确保可复用性

---

> 本设计规范文档随项目迭代持续更新。如有任何设计决策的变更，请同步更新本文档并标注版本号。
