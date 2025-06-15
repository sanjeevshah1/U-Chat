import { create } from "zustand";
import type { FriendRequest } from "../Components/FriendRequestsModal";
import api from "../utils/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface requestStoreInterface {
  friendRequests: FriendRequest[];
  setFriendRequests: (data: FriendRequest[]) => void;
  fetchFriendRequests: () => Promise<void>;
}

const useRequestStore = create<requestStoreInterface>((set) => ({
  friendRequests: [],
  setFriendRequests: (data) => set({ friendRequests: data }),
  fetchFriendRequests: async () => {
    try {
      const response = await api.get<{ requests: FriendRequest[] }>(
        "/contacts/requests"
      );
      set({ friendRequests: response.data.requests || [] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to load friend requests"
        );
      } else {
        toast.error("Failed to load friend requests");
      }
      set({ friendRequests: [] });
    }
  },
}));

export default useRequestStore;
