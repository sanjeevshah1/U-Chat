# U-Chat

A modern real-time chat application built with React, TypeScript, and Node.js.

## 🚀 Features

- Real-time messaging using Socket.IO
- User authentication and authorization
- Modern UI with Tailwind CSS and DaisyUI
- Type-safe development with TypeScript
- State management using Zustand
- Form validation with Zod
- Responsive design
- Toast notifications for better UX

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Socket.IO Client
- Zustand (State Management)
- React Router DOM
- Axios

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Redis for caching
- Cloudinary for media storage
- Pino for logging
- Zod (Schema Validation)

## 📦 Project Structure

```
u-chat/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── Components/    # Reusable UI components
│   │   ├── Pages/        # Page components
│   │   ├── store/        # Zustand store
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
└── server/                # Backend application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── services/     # Business logic
    │   ├── middlewares/  # Custom middlewares
    │   └── utils/        # Utility functions
    └── config/           # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- OpenSSL-generated RSA key pair

  - Place your key files in the `server/config` directory:
    - `public.pem`: Public key for encryption
    - `private.pem`: Private key for decryption
  - To generate new keys using OpenSSL:

    ```bash
    # Generate private key
    openssl genrsa -out private.pem 2048

    # Generate public key from private key
    openssl rsa -in private.pem -pubout -out public.pem
    ```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/u-chat.git
cd u-chat
```

2. Install dependencies:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

   - Create `.env` files in both client and server directories
   - Configure necessary environment variables (see `.env.example` files)
   - Ensure the paths to your public.pem and private.pem files are correctly set in your environment variables

4. Start the development servers:

```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd client
npm run dev
```

## 🔧 Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:1337`

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
