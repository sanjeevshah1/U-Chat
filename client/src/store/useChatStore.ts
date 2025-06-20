import { create } from "zustand";
import { Socket, io } from "socket.io-client";
export interface SelectContactType {
  id: string;
  fullname: string;
  profilePicture: string;
  isOnline: boolean;
}
interface ChatStoreState {
  selectedChat?: SelectContactType;
  setSelectedChat: (contactId: SelectContactType | undefined) => void;
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
}

const useChatStore = create<ChatStoreState>((set, get) => ({
  selectedChat: undefined,
  setSelectedChat: (contact: SelectContactType | undefined) => {
    set({ selectedChat: contact });
  },
  socket: null,
  isConnected: false,
  connect: () => {
    // Don't create a new connection if one already exists
    if (get().socket) return;

    const socket = io(
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_URL
        : "http://localhost:1337",
      {
        query: {
          userId: localStorage.getItem("userId"),
        },
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      }
    );

    set({ socket });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      set({ isConnected: true });
    });

    socket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error.message);
      set({ isConnected: false });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ isConnected: false });
    });
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

export default useChatStore;
