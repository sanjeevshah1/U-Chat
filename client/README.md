# U-Chat Client

This is the frontend for U-Chat, built with React, TypeScript, Vite, Tailwind CSS, and Zustand.

## Features

- Real-time chat UI
- Authentication (login/signup)
- Friend requests & contacts
- Responsive design
- Toast notifications

## Project Structure

```
src/
  Components/   # Reusable UI components
    - AddContactModlal.tsx
    - AuthImagePattern.tsx
    - AuthRequired.tsx
    - Chat.tsx
    - FriendRequestsModal.tsx
    - Navbar.tsx
    - Sidebar.tsx
  Pages/        # Main pages
    - Homepage.tsx
    - Login.tsx
    - Profile.tsx
    - Settings.tsx
    - Signup.tsx
  store/        # Zustand stores
    - useAuthStore.ts
    - useChatStore.ts
    - useRequestStore.ts
  utils/        # Utility functions
    - axios.ts
    - utils.ts
  App.tsx       # Main app component
  main.tsx      # Entry point
  types.ts      # TypeScript types
```

## Main Dependencies

- React 19
- TypeScript
- Vite
- Tailwind CSS & DaisyUI
- Zustand
- Socket.IO Client
- React Router DOM
- Axios
- Zod

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env` (see `.env.example`).
3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run lint` — Lint code
- `npm run preview` — Preview production build

## License

ISC
