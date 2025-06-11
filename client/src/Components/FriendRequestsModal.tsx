import React, { useState, useEffect } from "react";
import { X, User, Mail, Check, UserX, Loader2, Users } from "lucide-react";
import api from "../utils/axios";
import { toast } from "react-hot-toast";
import useRequestStore from "../store/useRequestStore";
export interface FriendRequest {
  _id: string;
  user: {
    _id: string;
    email: string;
    fullname: string;
    profilePicture: string;
  };
  contact: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string; // ISO string, can also be Date if parsed
}

export interface FriendRequestsResponse {
  requests: FriendRequest[];
}

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendRequestsModal = ({ isOpen, onClose }: FriendRequestsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { friendRequests, setFriendRequests } = useRequestStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );

  // Fetch friend requests when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    }
  }, [isOpen]);

  const fetchFriendRequests = async () => {
    console.log("the fetch is running");
    setIsLoading(true);
    try {
      const response =
        await api.get<FriendRequestsResponse>("/contacts/requests");
      console.log(response.data.requests);
      setFriendRequests(response.data.requests || []);
    } catch (error: any) {
      console.error("Error fetching friend requests:", error);
      toast.error("Failed to load friend requests");
      setFriendRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    console.log("executing accdpt");
    setProcessingId(requestId);
    setActionType(action);
    console.log("the action state is", action);
    try {
      await api.patch(`/contacts/requests/${requestId}/${action}`);

      // Remove the processed request from the list
      const updatedRequests = friendRequests.filter(
        (req) => req._id !== requestId
      );
      setFriendRequests(updatedRequests);

      toast.success(
        action === "accept"
          ? "Friend request accepted!"
          : "Friend request rejected"
      );
    } catch (error: any) {
      console.error(`Error ${action}ing friend request:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} friend request`
      );
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Friend Requests
              {friendRequests.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-3 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-600">
                  Loading friend requests...
                </p>
              </div>
            </div>
          ) : friendRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {friendRequests.map((request) => (
                <div key={request._id} className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {request.user.profilePicture ? (
                        <img
                          src={request.user.profilePicture}
                          alt={request.user.fullname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {request.user.fullname}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {request.user.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleFriendRequest(request._id, "accept")
                          }
                          disabled={processingId === request._id}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                        >
                          {processingId === request._id &&
                          actionType === "accept" ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleFriendRequest(request._id, "reject")
                          }
                          disabled={processingId === request._id}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                        >
                          {processingId === request._id &&
                          actionType === "reject" ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserX className="w-3 h-3" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium mb-1">No friend requests</p>
                <p className="text-xs">
                  You don't have any pending friend requests
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {friendRequests.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {friendRequests.length} pending friend request
              {friendRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal;
