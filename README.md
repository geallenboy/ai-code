# AI Code - 生成代码 ​

ai-code 是一个创新工具，利用人工智能生成用户界面（UI）组件的代码，并提供实时预览功能。这对于开发者或设计师快速原型设计非常有用，让他们能更高效地创建和测试 UI 元素，而无需手动编写大量代码。

## 项目预览

![login](./public/ai-code.gif)

## 🚀 主要功能

- **AI 驱动的代码生成**（用户用自然语言描述想要的 UI 组件，ai-code 会生成相应的代码，支持多种 AI 模型（如 Anthropic、Google、OpenAI 等），用户可根据需要选择。
- **实时 UI 预览**：生成代码后，工具会立即渲染，展示组件的外观和功能，帮助用户快速验证设计。
- **用户体验**：界面现代化，支持深色模式和响应式设计，适用于桌面端、移动端和平板设备。使用 Supabase 提供用户登录和数据存储功能。

---

## 🛠️ 技术栈

使用的关键技术及其作用的对比：

| **技术类别** | **依赖项示例**                    | **作用**                  |
| ------------ | --------------------------------- | ------------------------- |
| 前端框架     | Next.js (15.1.2)                  | SSR/SSG，提升性能和 SEO   |
| 样式工具     | Tailwind CSS, tailwindcss-animate | 快速构建现代 UI，动画支持 |
| AI 集成      | @ai-sdk/anthropic, ai             | 支持多种 AI 模型生成代码  |
| 代码解释     | @e2b/code-interpreter/代码解释器  | 实时解释和渲染生成的代码  |
| 用户管理     | Supabase, @upstash/ratelimit      | 认证、数据存储和速率限制  |
| UI 组件库    | Radix UI 系列                     | 可访问性强的交互组件      |

## 📥 安装 & 部署

### **快速启动**

```bash
# 1. 克隆代码仓库
git clone https://github.com/geallenboy/ai-code.git
cd ai-code

# 2. 安装依赖
pnpm install
# 或者 yarn
yarn install

# 3. 配置环境变量
cp .env.example .env
# 配置相关参数

# 4. 启动开发服务器
pnpm run dev
# 或 yarn dev

# 5. 访问本地应用
http://localhost:3000
```

---

## 🤝 贡献指南

### **如何贡献**

1. **Fork 本项目** 并创建新分支：
   ```bash
   git checkout -b feature-branch-name
   ```
2. **提交你的改动**：
   ```bash
   git commit -m "✨ 新增 Code 生成优化"
   ```
3. **推送代码**：
   ```bash
   git push origin feature-branch-name
   ```
4. **创建 Pull Request**，我们会尽快审核！🎉

---

## 📄 许可协议

本项目基于 **MIT 许可协议**，允许自由使用、修改和分发。  
详情请查看 [LICENSE](LICENSE) 文件。

---

## 🌍 联系我

如果你对 AI Logo 感兴趣，或者希望合作，请随时联系我！💬

📧 **Email**：[gejialun88@gmail.com](mailto:gejialun88@gmail.com)  
🐦 **Twitter**：[gejialun88](https://x.com/gejialun88)  
🌐 **个人网站**：[我的网站](https://gegarron.com)  
💬 **微信**：gegarron

---

## 🌟 Star & Fork 🌟

如果你喜欢这个项目，请 **Star ⭐ & Fork**，让更多人发现它！  
🔗 **GitHub Repo**：[AI Code](https://github.com/geallenboy/ai-code)

---

🔥 **立即 Fork & 开发，开启你的 AI 设计之旅！** 🚀
