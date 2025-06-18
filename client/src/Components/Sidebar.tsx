import { useEffect, useState } from "react";
import type { sidebarProps } from "../Pages/Homepage";
import { Search, User, Contact, X } from "lucide-react";
import api from "../utils/axios";
import AddContactModal from "./AddContactModlal";
import useRequestStore from "../store/useRequestStore";
import axios from "axios";
import useChatStore from "../store/useChatStore";
import type { SelectContactType } from "../store/useChatStore";

export type ContactResponse = {
  contacts: Contact[];
};

export type Contact = {
  _id: string;
  status: "accepted" | "pending" | "rejected";
  createdAt: string;
  friend: {
    _id: string;
    fullname: string;
    profilePicture: string;
    coverPicture: string;
    isOnline: boolean;
  };
};

interface ExtendedSidebarProps extends sidebarProps {
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showCloseButton?: boolean;
}

const Sidebar = ({
  filter,
  onClose,
  onFilterChange,
  showCloseButton = false,
}: ExtendedSidebarProps) => {
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedChat, setSelectedChat } = useChatStore();
  const [showFriendModal, setShowFriendModal] = useState(false);
  const { friendRequests } = useRequestStore();

  const fetchContacts = async () => {
    try {
      const response = await api.get<ContactResponse>("/contacts");
      setContacts(response.data.contacts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message);
      } else {
        setError("Error Fetching Contacts");
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [friendRequests]);

  const filteredContacts = contacts.filter(({ friend }) => {
    const matchesFilter =
      filter === "all" || (filter === "online" && friend.isOnline);

    const matchesSearch = friend.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleContactClick = (contact: SelectContactType) => {
    if (!selectedChat) {
      setSelectedChat(contact);
    } else if (contact.id !== selectedChat.id) {
      setSelectedChat(contact);
    } else {
      setSelectedChat(undefined);
    }
    // Close sidebar on mobile when contact is selected
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const onlineCount = contacts.filter(({ friend }) => friend.isOnline).length;

  return (
    <>
      <aside className="h-full w-full bg-white flex flex-col border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Contact className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={showCloseButton ? "online-mobile" : "online-desktop"}
              name={showCloseButton ? "online-mobile" : "online-desktop"}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={filter === "online"}
              onChange={onFilterChange}
            />
            <label
              htmlFor={showCloseButton ? "online-mobile" : "online-desktop"}
              className="text-sm text-gray-700"
            >
              Show only online
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{filteredContacts.length} contacts</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {onlineCount} online
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredContacts.map(({ _id, friend }) => (
                <div
                  key={_id}
                  onClick={() =>
                    handleContactClick({
                      id: friend._id,
                      fullname: friend.fullname,
                      profilePicture: friend.profilePicture,
                      isOnline: friend.isOnline,
                    })
                  }
                  className={`flex cursor-pointer items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-150 ${
                    selectedChat?.id === _id
                      ? "bg-purple-50 border-r-2 border-purple-500"
                      : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={friend.fullname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Online status indicator */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                        friend.isOnline ? "bg-green-400" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {friend.fullname}
                      </h3>
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        friend.isOnline ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {friend.isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium mb-1">No contacts found</p>
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setShowFriendModal(true)}
                >
                  Add Friends
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      <AddContactModal
        isOpen={showFriendModal}
        onClose={() => setShowFriendModal(false)}
      />
    </>
  );
};

export default Sidebar;
