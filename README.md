# Node.js Express TypeScript Backend

Backend API menggunakan Node.js, Express, TypeScript, Mongoose, dan validasi dengan Zod.

## Fitur

- 🚀 Node.js & Express
- 📘 TypeScript
- 🗄️ MongoDB dengan Mongoose
- 🔐 Autentikasi JWT
- 🛡️ Validasi dengan Zod
- 🐳 Docker & Docker Compose
- 🧪 Integration Testing
- 📝 Logging
- 🔄 Hot-reload development dengan Nodemon

## Struktur Project

```
my-backend-app/
│
├── src/                          # Source code utama
│   ├── config/                   # Konfigurasi aplikasi
│   ├── controllers/              # Controller untuk menangani request
│   ├── middlewares/              # Middleware aplikasi
│   ├── models/                   # Model Mongoose
│   ├── routes/                   # Definisi routes
│   ├── schemas/                  # Zod validation schemas
│   ├── services/                 # Business logic
│   ├── types/                    # Type definitions
│   ├── utils/                    # Utility functions
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Entry point utama
│
├── tests/                        # Test files
│   ├── integration/              # Integration tests
│   └── unit/                     # Unit tests
│
├── docker/                       # Docker configurations
├── .env.example                  # Example environment variables
└── ...                           # Various config files
```

## Requirements

- Node.js (versi 18+)
- MongoDB
- Docker (opsional)

## Instalasi

### Menggunakan npm

```bash
# Clone repositori
git clone https://github.com/username/my-backend-app.git
cd my-backend-app

# Install dependencies
npm install

# Salin .env.example ke .env dan sesuaikan
cp .env.example .env

# Jalankan aplikasi di mode development
npm run dev
```

### Menggunakan Docker

```bash
# Clone repositori
git clone https://github.com/username/my-backend-app.git
cd my-backend-app

# Salin .env.example ke .env dan sesuaikan
cp .env.example .env

# Jalankan dengan docker-compose
docker-compose up
```

## Penggunaan

Setelah server berjalan, API tersedia di:

```
http://localhost:3000/api
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Dapatkan profil user saat ini (perlu auth)
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/profile` - Dapatkan profil user (perlu auth)
- `PUT /api/users/profile` - Update profil user (perlu auth)
- `GET /api/users` - Dapatkan semua user (perlu auth admin)
- `GET /api/users/:id` - Dapatkan user by ID (perlu auth admin)
- `PUT /api/users/:id` - Update user (perlu auth admin)
- `DELETE /api/users/:id` - Delete user (perlu auth admin)

## Pengujian

```bash
# Jalankan semua test
npm test

# Jalankan integration test
npm run test:integration

# Jalankan test dengan coverage
npm run test:coverage
```

## Build untuk Production

```bash
# Build TypeScript ke JavaScript
npm run build

# Jalankan aplikasi production
npm start
```

## Docker

```bash
# Development (dengan hot-reload)
npm run docker:dev

# Build untuk production
npm run docker:build
```

## Lisensi

ISC