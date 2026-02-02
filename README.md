# 🚀 LeetClone – Full Stack Coding Platform

A full-stack **LeetCode-style coding platform** built using **Next.js App Router**, featuring authentication, submissions, playlists, user profiles, and OAuth.

🔗 Repository: https://github.com/Coding-Alchemist-Abhijay/Leetcode-Clone

---

## ✨ Features

- 🔐 Email + GitHub OAuth Authentication
- 🧠 Coding Problems & Submissions
- 📊 User Profiles & Statistics
- 📁 Playlists & Solved Problems
- ⚡ Redis-based Session Management
- 🧩 Prisma ORM
- 🛢 PostgreSQL Database
- 🚀 Next.js App Router
- 🔒 Secure HTTP-only Cookies

---

## 🛠 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js, Tailwind CSS |
| Backend | Next.js API Routes |
| Auth | GitHub OAuth, Cookies |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |

---

## 📦 Clone Repository

```bash
git clone https://github.com/Coding-Alchemist-Abhijay/Leetcode-Clone.git
cd Leetcode-Clone
```

---

## ▶️ Getting Started

### Install Dependencies
```bash
npm install
```

### Setup Environment Variables
Create a `.env` file:

```env
DATABASE_URL=
REDIS_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Prisma Migration
```bash
npx prisma migrate dev
```

### Start Development Server
```bash
npm run dev
```

App runs at:  
http://localhost:3000

---

## 📂 Project Structure

```text
app/
 ├─ api/
 ├─ profile/
 ├─ login/
 ├─ (oauth)/
lib/
 ├─ db.ts
 ├─ redis.ts
 ├─ oauth/
prisma/
 ├─ schema.prisma
```

---

## 🔐 Authentication Flow

1. User logs in via GitHub or Email
2. OAuth tokens validated
3. User stored in database
4. Session stored in Redis
5. session_id cookie set (HTTP-only)

---

## 🧪 Project Status

🟢 Active Development

Planned:
- Online judge execution engine
- Problem tags & difficulty levels
- Admin dashboard
- Discussion forums

---

## 🤝 Contributing

```bash
git checkout -b feature-name
git commit -m "Add feature"
git push origin feature-name
```

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

## 👨‍💻 Author

Coding-Alchemist-Abhijay  
https://github.com/Coding-Alchemist-Abhijay

Happy Coding 💻🔥
