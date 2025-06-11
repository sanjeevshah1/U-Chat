import {create} from "zustand"
interface ChatStoreState{
    selectedChat: string;
    setSelectedChat: (contactId : string) => void;
}
const chatStore = create<ChatStoreState>((set) => ({
    selectedChat : "",
    setSelectedChat : (contactId: string) => {
        set({selectedChat : contactId})
    }
}))

export default chatStore