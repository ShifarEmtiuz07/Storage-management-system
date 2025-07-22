# 📦 Storage Management System

A secure and scalable **Storage Management System** built with **NestJS**, featuring Google OAuth 2.0 authentication, PostgreSQL integration, and modular architecture.

---

## 🚀 Features

- Google Sign-In (OAuth2.0) integration
- Secure JWT authentication
- PostgreSQL support with TypeORM
- Environment-based configuration management
- BCrypt password hashing (if applicable)
- Modular, scalable NestJS architecture
- Full file management functionality

---

## 🛠 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShifarEmtiuz07/Storage-management-system
cd storage-management-system

```


### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

Create a `.env` file in the root of your project and add the following environment variables. Replace placeholder values with your actual credentials.

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=storageManagement

# Application Environment
NODE_ENV=development
DB_SYNCHRONIZE=true

# Security Config
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```


---

## 🔑 Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.developers.google.com/).
2. Create or select a project.
3. Set up the **OAuth consent screen**.
4. Create **OAuth 2.0 credentials**:

   * Add your **Redirect URI** (e.g., `http://localhost:3000/auth/google/redirect`).
   * Copy the generated **Client ID** and **Client Secret** into your `.env` file.

---

## ✨ OAuth Flow

1. Client requests the Google login URL from backend (`/auth/google/url`).
2. User authenticates via Google and gets redirected with a `code`.
3. Backend exchanges the code for tokens and retrieves the user's profile.
4. JWT token is generated and returned to the client.

---
🔐 Configuration Note for Google OAuth Integration

Before using this service for Google Sign-In, please ensure you replace all placeholder values with your actual credentials and configuration:

** client_id: Replace with your Google OAuth 2.0 Client ID from the Google Developer Console.

** client_secret: Replace with your Google OAuth 2.0 Client Secret.

** redirect_uri: Set to the authorized redirect URI configured in your Google Cloud project.

** rootUrl: Set this to the appropriate Google OAuth 2.0 authorization endpoint, typically https://accounts.google.com/o/oauth2/v2/auth.

** jwt_secret: Replace 'change your jwt_secret' with your actual JWT secret key. For security, store this value in an environment variable (e.g., process.env.JWT_SECRET).

---

## 🗃️ Database Setup

This project uses **PostgreSQL** with TypeORM. Connection settings are managed via environment variables.

> Ensure PostgreSQL is running and a database named `storageManagement` is created (or adjust the name in `.env`).

---

## 👨‍💻 Author

Made with ❤️ by \[A. B. M. Shifar Emtiuz]



