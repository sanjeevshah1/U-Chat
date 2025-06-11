import { create } from "zustand";
import { FriendRequest } from "../Components/FriendRequestsModal";

interface requestStoreInterface {
  friendRequests: FriendRequest[];
  setFriendRequests: (data: FriendRequest[]) => void;
}

const useRequestStore = create<requestStoreInterface>((set) => ({
  friendRequests: [],
  setFriendRequests: (data) => set({ friendRequests: data }), // ✅ fixed function name
}));

export default useRequestStore;
