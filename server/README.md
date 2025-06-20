# U-Chat Server

This is the backend for U-Chat, built with Node.js, Express, TypeScript, MongoDB, and Socket.IO.

## Features

- Real-time messaging with Socket.IO
- JWT authentication
- User, contact, and message management
- Redis caching
- Cloudinary media storage

## Project Structure

```
src/
  controllers/   # Route controllers
    - auth.controller.ts
    - contact.controller.ts
    - message.controller.ts
  models/        # Mongoose models
    - user.model.ts
    - contact.model.ts
    - message.model.ts
    - session.model.ts
  routes/        # API routes
    - auth.routes.ts
    - contact.route.ts
    - message.routes.ts
  services/      # Business logic
    - user.service.ts
    - contacts.service.ts
    - session.service.ts
  middlewares/   # Custom middlewares
    - deserealizeUser.ts
    - requireUser.ts
    - validateResource.ts
  schema/        # Zod validation schemas
    - user.schema.ts
    - contact.schema.ts
    - message.schema.ts
  utils/         # Utility functions
    - connect.ts
    - cloudinary.utils.ts
    - jwt.utils.ts
    - logger.ts
    - redis.utils.ts
    - routes.ts
    - socket.ts
  app.ts         # Express app entry
  types.ts       # TypeScript types
```

## Main Dependencies

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Socket.IO
- JWT
- Redis (ioredis)
- Cloudinary
- Zod
- Pino (logging)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env` (see `.env.example`).
3. Generate RSA keys and place them in `config/`:
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run lint` — Lint code
- `npm run test` — Run tests

## API Documentation

### Auth Routes (`/api/auth`)

| Method | Endpoint          | Description                   | Auth Required | Request Body / Params                            | Response Example                            |
| ------ | ----------------- | ----------------------------- | ------------- | ------------------------------------------------ | ------------------------------------------- |
| GET    | `/`               | Test route                    | No            | -                                                | `{ message }`                               |
| POST   | `/signup`         | Register a new user           | No            | `{ email, fullname, password, profilePicture? }` | `{ success, message, accessToken, userId }` |
| POST   | `/login`          | Login user                    | No            | `{ email, password }`                            | `{ success, message, accessToken, userId }` |
| POST   | `/logout`         | Logout user (blacklist token) | No            | -                                                | `{ message }`                               |
| POST   | `/refresh`        | Refresh access token          | No            | Cookie: refreshToken                             | `{ success, message, accessToken }`         |
| PUT    | `/profile`        | Update user profile           | Yes           | `{ updates: { ... } }`                           | `{ success, message, updatedUser }`         |
| GET    | `/profile`        | Get current user profile      | Yes           | -                                                | `{ success, user }`                         |
| PATCH  | `/profilepicture` | Update profile picture        | Yes           | FormData/Image                                   | `{ success, message, updatedUser }`         |
| PATCH  | `/profile`        | Update user profile (partial) | Yes           | `{ updates: { ... } }`                           | `{ success, message, updatedUser }`         |
| GET    | `/users/search`   | Search users by query         | No            | `?q=searchTerm`                                  | `{ success, users }`                        |

### Contact Routes (`/api/contacts`)

| Method | Endpoint                       | Description                       | Auth Required | Request Body / Params                             | Response Example                |
| ------ | ------------------------------ | --------------------------------- | ------------- | ------------------------------------------------- | ------------------------------- |
| GET    | `/`                            | Get current user's contacts       | Yes           | -                                                 | `{ success, contacts }`         |
| DELETE | `/delete`                      | Delete all contacts (admin/dev)   | Yes           | -                                                 | `{ success, message }`          |
| POST   | `/add`                         | Send a contact/friend request     | Yes           | `{ recipientId }`                                 | `{ success, message, contact }` |
| PATCH  | `/requests/:requestId/:action` | Accept/Reject a contact request   | Yes           | Params: `requestId`, `action` (`accept`/`reject`) | `{ success, message, contact }` |
| GET    | `/requests`                    | Get all received contact requests | Yes           | -                                                 | `{ success, requests }`         |

### Message Routes (`/api/messages`)

| Method | Endpoint    | Description              | Auth Required | Request Body / Params   | Response Example           |
| ------ | ----------- | ------------------------ | ------------- | ----------------------- | -------------------------- |
| GET    | `/:id`      | Get messages with a user | Yes           | Params: `id` (friendId) | `{ success, messages }`    |
| POST   | `/send/:id` | Send a message to a user | Yes           | `{ text, image? }`      | `{ success, sentMessage }` |

**Notes:**

- All endpoints that require authentication expect a valid JWT access token in the `Authorization: Bearer <token>` header, except for login, signup, refresh, and logout.
- Some endpoints use cookies for refresh tokens.
- Error responses are always in the form `{ success: false, message: string }`.

## License

MIT
