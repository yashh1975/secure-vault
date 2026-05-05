# SecureVault – Military-Grade Encrypted Cloud Storage

🔗 **Live Application**
👉 [https://secure-vault-umber.vercel.app/](https://secure-vault-umber.vercel.app/)

---

## 🎯 Project Overview

**SecureVault** is a premium, visually stunning web application designed for maximum-security file storage and sharing. Unlike traditional cloud storage, SecureVault implements **Zero-Knowledge Encryption**—every file is encrypted using **AES-256-CBC** on the backend before it ever touches the cloud. The app features a high-end **Glassmorphism UI** with a dynamic mesh-gradient background, making it as beautiful as it is secure.

---

## ✨ Features

*   **🔒 Military-Grade Encryption** – Uses AES-256-CBC to encrypt files. The raw data is never stored, ensuring total privacy.
*   **☁️ Hybrid Cloud Infrastructure** – Combines **MongoDB Atlas** for metadata tracking and **AWS S3** for infinitely scalable binary storage.
*   **🔗 Secure Sharing** – Generate time-limited, self-expiring links for sharing files with anyone. Decryption happens on-the-fly during download.
*   **🗑️ Trash & Recovery** – Integrated soft-deletion system. Accidentally deleted a file? Restore it from the Trash Bin or purge it forever.
*   **📂 Bulk Operations** – Select multiple files to restore, delete, or manage efficiently.
*   **🎨 Premium UI** – Custom glass-morphism aesthetic with dark-mode optimized colors, smooth-scroll navigation, and micro-animations.
*   **📱 Fully Responsive** – A seamless experience across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Framer Motion, Lucide-React |
| **Backend** | Node.js, Express, JWT Authentication, Crypto (AES-256), Multer |
| **Database** | MongoDB Atlas (Cloud Cluster), Mongoose |
| **Cloud Storage** | Amazon Web Services (AWS) S3 |
| **Hosting** | Vercel (Frontend), Render (Backend API) |

---

## 📁 Repository Structure

```text
secure-file-storage/
├── backend/                # Node.js API
│   ├── config/             # Database & AWS configurations
│   ├── controllers/        # Business logic (Auth, Files, Sharing)
│   ├── middleware/         # Security & Audit logging
│   ├── models/             # Mongoose schemas (User, File, SharedLink)
│   ├── routes/             # API Endpoints
│   ├── utils/              # Encryption & S3 utility functions
│   └── server.js           # Entry point
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Modals, Navbar, etc.)
│   │   ├── pages/          # Full pages (Dashboard, Login, Upload)
│   │   ├── store/          # Zustand state management
│   │   └── utils/          # API wrapper and helpers
│   ├── index.html
│   └── tailwind.config.js
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (>= 18) and **npm**
*   **MongoDB Atlas** account
*   **AWS IAM User** with S3 permissions

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yashh1975/secure-vault.git
   cd secure-file-storage
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

---

## 📦 Deployment

This application is designed for a split-cloud deployment:
*   **Backend:** Hosted on **Render** (as a Web Service). Root directory: `backend`.
*   **Frontend:** Hosted on **Vercel**. Root directory: `frontend`.
*   **Environment Variables:** Ensure all keys (`AWS_KEYS`, `MONGO_URI`, `ENCRYPTION_KEY`) are mirrored in the Render/Vercel dashboard settings.

---

## 🎨 Design Philosophy

SecureVault follows a **"Deep Tech" aesthetic**:
*   **Dark-Mode First**: Deep indigo and violet backgrounds.
*   **Glass-like cards**: `backdrop-blur` and semi-transparent borders for a premium feel.
*   **Subtle micro-animations**: Scale-up and fade-in effects using Framer Motion.
*   **Branding**: Custom SVG logo design integrated throughout the interface.

---

## 📜 License

This project is open-source under the **MIT License**. Feel free to fork, modify, and deploy it for personal or commercial use.

---

## 🙏 Acknowledgements

*   **AWS S3** – For providing industry-standard reliable storage.
*   **Lucide-React** – For the beautiful and consistent icon system.
*   **Render & Vercel** – For making modern deployment effortless.

---

## Author

**Yash**

*Happy coding, and enjoy your own private, encrypted vault!*
