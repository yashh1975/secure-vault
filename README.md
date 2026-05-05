# SecureVault - Secure File Storage System

A full-stack, production-ready web application for securely storing, encrypting, and sharing files.

## Features

- **End-to-End File Encryption:** Files are encrypted using AES-256-CBC in memory before being uploaded to S3.
- **Secure File Sharing:** Generate time-limited (30 min) secure links for your encrypted files.
- **Authentication:** JWT-based authentication with access and refresh tokens. Passwords are hashed with bcrypt.
- **S3 Integration:** Files are stored securely in AWS S3 buckets.
- **Rate Limiting & Security:** Built with `helmet`, `express-rate-limit`, and robust input validation.
- **Audit Logging:** Every file access, upload, download, and share action is logged for tracking.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Zustand, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Storage:** AWS S3
- **Encryption:** Node.js Crypto module (AES-256-CBC)

## Prerequisites

- Node.js (v18+)
- MongoDB connection string (e.g., MongoDB Atlas)
- AWS Account with an S3 Bucket set up
- S3 Bucket requires a private policy (no public access)

## Setup Instructions

### 1. Clone the repository

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
ENCRYPTION_KEY=your_32_byte_hex_string_key
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

## API Documentation

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/refresh` - Get a new access token

### Files
- `POST /api/files/upload` - Upload a file (multipart/form-data)
- `GET /api/files` - List all files for the authenticated user
- `GET /api/files/:id/download` - Download a decrypted file
- `DELETE /api/files/:id` - Delete a file

### Share
- `POST /api/files/:id/share` - Generate a secure share link
- `GET /api/share/:token` - Access a shared file

### Admin
- `GET /api/admin/files` - List all files across all users (Requires 'admin' role)

## Deployment Notes

- **Frontend:** Can be deployed easily on Vercel. Ensure you set the `VITE_API_URL` environment variable to your production backend URL.
- **Backend:** Can be deployed on Render, Railway, or any Node.js hosting platform. Ensure all environment variables from `.env` are configured in the deployment platform.
- **Database:** Use MongoDB Atlas for a scalable, cloud-hosted database.
- **Storage:** Use AWS S3. Ensure the IAM user has `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions for the specific bucket.
