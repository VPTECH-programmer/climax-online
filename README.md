# 🌐 Climax Online
### Government Job & Vacancy News Portal — Rewa, Madhya Pradesh

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com)
![License](https://img.shields.io/badge/license-Private-blue)
![Made for](https://img.shields.io/badge/Made%20for-Rewa%2C%20MP-orange)

---

## 📌 About

**Climax Online** is a free government job portal and vacancy news blog built for Rewa, Madhya Pradesh. It allows the admin to publish latest job notifications, results, admit cards, answer keys and syllabus updates — which visitors can instantly share on WhatsApp with one click.

> MP Online Authorized Service Center — Rewa, M.P.

---

## ✨ Features

- 📰 Blog-style post cards with image, category badge and last date
- 🔍 Search and category filter (Jobs, Results, Admit Cards, Answer Keys, Syllabus)
- 📲 One-click WhatsApp share with full post details
- 🔴 Live scrolling news ticker
- 🔐 Secure admin panel — password never stored in code
- 📱 Fully mobile responsive
- ⚡ Fast — no framework, pure HTML/CSS/JS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Netlify Functions (Serverless) |
| Database | JSONBin.io REST API |
| Hosting | Netlify (Free) |
| Security | SHA-256 password hashing + Server-side env variables |

---

## 📁 Project Structure

```
climax-online/
├── index.html                  ← Public homepage
├── netlify.toml                ← Netlify configuration
├── css/
│   └── style.css               ← All styles (Deep Blue theme)
├── js/
│   └── app.js                  ← Frontend logic
├── admin/
│   ├── login.html              ← Admin login page
│   └── dashboard.html          ← Post management panel
└── netlify/
    └── functions/
        ├── posts.js            ← Serverless: read/write posts
        └── auth.js             ← Serverless: verify admin password
```

---

## 🚀 Deployment

This site is deployed on **Netlify** with environment variables for all secrets.

No API keys or passwords are stored in this repository.

For full setup instructions → see [`SETUP_INSTRUCTIONS.md`](./SETUP_INSTRUCTIONS.md)

---

## 🔒 Security

- Admin password is verified **server-side** via Netlify Functions
- Only a **SHA-256 hash** is compared — original password never stored anywhere in code
- JSONBin API Key lives exclusively in **Netlify Environment Variables**
- Public users can only **read** posts — write operations require admin hash verification

---

## 📲 WhatsApp Sharing

Every post has a **📲 Share** button that opens WhatsApp with a pre-filled message containing the post title, description, last date, vacancy count and site link — making it easy to forward updates to WhatsApp groups instantly.

---

## 🗂️ Post Categories

| Category | Description |
|---|---|
| 💼 Latest Job | New government job notifications |
| 📊 Result | Exam results declared |
| 🪪 Admit Card | Hall ticket download links |
| 🗝️ Answer Key | Official answer keys |
| 📚 Syllabus | Exam syllabus and patterns |
| 📰 News | General government updates |

---

## 📍 About Climax Online

**Climax Online** is an MP Online Authorized Service Center located in Rewa, Madhya Pradesh. We provide government services, form filling, and keep students and job seekers updated with the latest government job notifications.

---

*Built with ❤️ for Rewa | © 2026 Climax Online, Rewa, M.P.*
