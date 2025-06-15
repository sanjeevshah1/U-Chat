import { useState } from "react";
import { Search, X, UserPlus, Mail, User, Loader2 } from "lucide-react";
import api from "../utils/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface SearchUser {
  _id: string;
  fullname: string;
  email: string;
  profilePicture?: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  users: SearchUser[];
}

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContactModal = ({ isOpen, onClose }: FriendRequestModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await api.get<SearchResponse>(
        `/auth/users/search?q=${encodeURIComponent(searchTerm)}`
      );
      console.log(response.data.users);
      setSearchResults(response.data.users || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        console.error("Error searching users:", error);
        toast.error("Failed to search users");
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    setSendingTo(userId);
    console.log("tHe user is is", userId);
    try {
      await api.post("/contacts/add", { recipientId: userId });
      setSentRequests((prev) => new Set([...prev, userId]));
      toast.success("Friend request sent successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error sending friend request:", error);
        toast.error(
          error.response?.data?.message || "Failed to send friend request"
        );
      } else {
        console.error("Error sending friend request:", error);
        toast.error("Failed to send friend request");
      }
    } finally {
      setSendingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchUsers();
    }
  };

  const resetModal = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
    setSentRequests(new Set());
    setSendingTo(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Add Friends</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={searchUsers}
              disabled={!searchTerm.trim() || isSearching}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 overflow-y-auto">
          {!hasSearched ? (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Search for users to add as friends</p>
                <p className="text-xs text-gray-400 mt-1">
                  You can search by name or email
                </p>
              </div>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-purple-600 animate-spin" />
                <p className="text-sm text-gray-600">Searching users...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map((user) => (
                <div key={user._id} className="p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {user.fullname}
                    </h3>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {sentRequests.has(user._id) ? (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Request Sent
                      </div>
                    ) : (
                      <button
                        onClick={() => sendFriendRequest(user._id)}
                        disabled={sendingTo === user._id}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-400 transition-colors text-xs font-medium flex items-center gap-1"
                      >
                        {sendingTo === user._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserPlus className="w-3 h-3" />
                        )}
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium mb-1">No users found</p>
                <p className="text-xs">
                  Try searching with a different name or email
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Friend requests will be sent to the selected users
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
