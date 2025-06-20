import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  MoreVertical,
  Paperclip,
  Phone,
  Video,
  Check,
  CheckCheck,
} from "lucide-react";
import { convertToBase64 } from "../utils/utils";
import useChatStore from "../store/useChatStore";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../utils/axios";
import type { Message } from "./../types";

// Animated Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500 mr-2">Typing</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const { socket, selectedChat } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = localStorage.getItem("userId");

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]); // Added isTyping to dependencies

  // Fetch initial messages when chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?.id) return;

      setIsLoading(true);
      setConnectionError(false);

      try {
        // Updated API endpoint to match your backend
        const response = await api.get(`/messages/${selectedChat.id}`);
        console.log(response.data);
        // Handle the response structure from your API
        if (response.data.success) {
          setMessages(response.data.messages || []);
        } else {
          toast.error(response.data.message || "Failed to load messages");
        }
      } catch (error) {
        setConnectionError(true);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Failed to load messages";
          toast.error(errorMessage);
        } else {
          toast.error("Unexpected error loading messages");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some((msg) => msg._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    };

    const handleMessageStatus = (data: {
      messageId: string;
      status: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, status: data.status as Message["status"] }
            : msg
        )
      );
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === selectedChat?.id) {
        setIsTyping(data.isTyping);
      }
    };

    const handleConnectionError = () => {
      setConnectionError(true);
      toast.error("Connection lost. Trying to reconnect...");
    };

    const handleReconnect = () => {
      setConnectionError(false);
      toast.success("Reconnected!");
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageStatus", handleMessageStatus);
    socket.on("typing", handleTyping);
    socket.on("disconnect", handleConnectionError);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageStatus", handleMessageStatus);
      socket.off("typing", handleTyping);
      socket.off("disconnect", handleConnectionError);
      socket.off("connect", handleReconnect);
    };
  }, [socket, currentUserId, selectedChat?.id]);

  const handleTypingStart = useCallback(() => {
    if (!socket || !selectedChat?.id) return;

    socket.emit("typing", {
      userId: currentUserId,
      receiverId: selectedChat.id,
      isTyping: true,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        userId: currentUserId,
        receiverId: selectedChat.id,
        isTyping: false,
      });
    }, 3000);
  }, [socket, selectedChat?.id, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (!newMessage.trim() && !selectedImage) ||
      !currentUserId ||
      !selectedChat?.id
    )
      return;

    const tempId = `temp-${Date.now()}`;
    const message: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedChat.id,
      text: newMessage.trim(),
      image: selectedImage || undefined,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    // Add message optimistically
    setMessages((prev) => [...prev, message]);
    const messageText = newMessage.trim();
    const imageToSend = selectedImage;

    // Clear input
    setNewMessage("");
    setSelectedImage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await api.post(`/messages/send/${selectedChat.id}`, {
        text: messageText,
        image: imageToSend,
      });

      if (response.data.success) {
        // Update the temporary message with the real message from server
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId
              ? { ...response.data.sentMessage, status: "sent" }
              : msg
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.log("error sending message", error);
      // Remove the failed message or mark it as failed
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send message");
      } else {
        toast.error("Failed to send message");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    adjustTextareaHeight();
    if (value.trim()) {
      handleTypingStart();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Only image files are allowed, ${file.type} not allowed`);
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setSelectedImage(base64);
        toast.success("Image selected!");
      } catch (error) {
        console.log("Error processing image:", error);
        toast.error("Failed to process image");
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage("");
  };

  const isSentByMe = (msg: Message) => msg.senderId === currentUserId;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const renderMessageStatus = (status?: Message["status"]) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 border border-blue-300 border-t-transparent rounded-full animate-spin" />
        );
      case "sent":
        return <Check className="w-3 h-3 text-blue-200" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-200" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-300" />;
      default:
        return null;
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4.7rem)] bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Chat Selected
          </h3>
          <p className="text-gray-500">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }
  //
  return (
    <div className="flex-1 flex flex-col w-full h-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4.7rem)] border-t-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {selectedChat.profilePicture ? (
              <img
                src={selectedChat.profilePicture}
                alt={selectedChat.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedChat.fullname?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {selectedChat.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedChat.fullname}
            </h3>
            <p
              className={`text-sm transition-colors duration-200 ${
                isTyping
                  ? "text-blue-500 font-medium"
                  : selectedChat.isOnline
                    ? "text-green-500"
                    : "text-gray-500"
              }`}
            >
              {isTyping ? (
                <span className="flex items-center">
                  <span>Typing</span>
                  <span className="flex ml-1 space-x-0.5">
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></span>
                    <span
                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </span>
                </span>
              ) : selectedChat.isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {connectionError && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto h-full bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${isSentByMe(message) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isSentByMe(message)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="w-full h-auto rounded-lg mb-2 max-w-sm"
                    />
                  )}
                  {message.text && (
                    <p className="text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                  )}
                  <div
                    className={`flex items-center justify-end mt-1 space-x-1 ${
                      isSentByMe(message) ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.createdAt && (
                      <span className="text-xs">
                        {formatTime(message.createdAt)}
                      </span>
                    )}
                    {isSentByMe(message) && renderMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && <TypingIndicator />}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        {/* Image preview */}
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-32 max-h-32 rounded-lg border"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 pr-12 text-black border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              rows={1}
              style={{ minHeight: "44px" }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() && !selectedImage}
            className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default Chat;
