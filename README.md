# Create README.md
echo "# Touhid Portfolio

## 🚀 Full Stack Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Node.js.

## ✨ Features

- 📱 Fully responsive design
- 🌙 Dark mode support
- ⚡ Fast performance with Next.js
- 🎨 Modern UI with Tailwind CSS
- 📝 Blog/Project management system
- 🔒 Admin panel with authentication
- 🖼️ Screenshot gallery for projects
- 🔍 Search and filter functionality

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

### DevOps
- Vercel (Frontend)
- Neon (Database)
- GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your database URL
npx prisma db push
npm run seed
npm run dev
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
# Update .env.local with your API URL
npm run dev
\`\`\`

## 🔑 Admin Access

- Email: admin@example.com
- Password: admin123

## 📁 Project Structure

\`\`\`
portfolio-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (website)/
│   │   ├── admin/
│   │   ├── components/
│   │   └── api/
│   ├── public/
│   └── package.json
└── README.md
\`\`\`

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

## 📝 License

MIT © Touhid Hossain

## 🤝 Contact

- Email: hello@touhidportfolio.com
- GitHub: [touhid365](https://github.com/touhid365)
- LinkedIn: [Touhid Hossain](https://www.linkedin.com/in/touhid-hossain-1155602bb/)
- X: [@ami_touhid_](https://x.com/ami_touhid_)" > README.md