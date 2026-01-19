# 📊 AWS Internship Report

> **A professional, bilingual internship report built with modern web technologies**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)

## 🌟 Overview

This is a modern, interactive internship report web application documenting my journey as an **FCJ Cloud Intern** at **Amazon Web Services Vietnam**. The project showcases cloud computing skills, AWS service knowledge, and hands-on lab experiences during the First Cloud Journey Internship Program.

### ✨ Key Features

- 🌐 **Bilingual Support** - Full Vietnamese & English language toggle
- 📱 **Responsive Design** - Optimized for all devices
- 🎨 **AWS Branding** - Follows official AWS color palette and design guidelines
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast performance
- 🎭 **Smooth Animations** - Page transitions powered by Framer Motion
- 📝 **Markdown Content** - Easy-to-update content management system

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router DOM (HashRouter) |
| **Animations** | Framer Motion |
| **Markdown** | React Markdown + remark-gfm |
| **Icons** | Lucide React |
| **Code Highlighting** | react-syntax-highlighter |

## 📁 Project Structure

```
quanchu-aws-report/
├── content/                  # Markdown content (bilingual)
│   ├── worklog/             # Weekly worklog entries
│   ├── events/              # Event participation records
│   ├── workshop/            # Workshop documentation
│   ├── home.{en,vi}.md      # Profile information
│   ├── proposal.{en,vi}.md  # Project proposal
│   ├── evaluation.{en,vi}.md # Self-evaluation
│   └── feedback.{en,vi}.md   # Feedback & insights
├── public/                   # Static assets
│   └── images/              # Report images & diagrams
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/              # UI primitives (Breadcrumb, etc.)
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── MarkdownRenderer.tsx # Markdown display component
│   │   └── AnimatedPage.tsx # Page transition wrapper
│   ├── contexts/            # React Context providers
│   │   └── LanguageContext.tsx # Language state management
│   ├── data/                # Static data
│   │   └── navigationStructure.ts # Navigation menu config
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── WorklogPage.tsx  # Worklog overview & detail pages
│   │   ├── WorkshopPages.tsx # Workshop documentation
│   │   ├── EventsPage.tsx   # Events participation
│   │   ├── ProposalPage.tsx # Project proposal
│   │   ├── EvaluationPage.tsx # Self-evaluation
│   │   └── FeedbackPage.tsx # Feedback & reflections
│   ├── utils/               # Utility functions
│   │   ├── contentLoader.ts # Dynamic content loading
│   │   └── eventLoader.ts   # Event data parsing
│   ├── App.tsx              # Main app component with routes
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles & Tailwind imports
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/CAQuan04/QuanChu-AWS-intership-report.git
cd QuanChu-AWS-intership-report

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment

### GitHub Pages

This project is configured for easy deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages
npm run deploy
```

The site will be published at: `https://caquan04.github.io/QuanChu-AWS-intership-report/`

## 📚 Content Management

All content is stored in Markdown format under the `content/` directory:

- Each content file has both `.en.md` (English) and `.vi.md` (Vietnamese) versions
- Images are stored in `public/images/`
- Content is automatically loaded based on the selected language

To add or update content:

1. Edit the corresponding Markdown file in `content/`
2. Add images to `public/images/` if needed
3. Reference images using `/quanchu-aws-report/images/your-image.png`

## 🎨 Design Philosophy

- **AWS Branding**: Official AWS navy (#232f3e) and orange (#ff9900) colors
- **Clean & Professional**: Minimalist design focusing on content readability
- **Smooth Interactions**: Subtle animations and hover effects for better UX
- **Accessible**: Semantic HTML and keyboard navigation support

## 👤 Author

**Chu Anh Quân**
- Email: quanchu505523@gmail.com
- Institution: FPT University
- Program: Software Engineering
- Internship: FCJ Cloud Intern at AWS Vietnam (Jan 05 - Apr 05, 2026)

## 📄 License

This project is created for educational purposes as part of the First Cloud Journey Internship Program.

---

⭐ **If you find this project helpful, please consider giving it a star!**
