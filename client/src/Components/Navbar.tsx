import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  UserPlus,
  Users,
  Menu,
  X,
  Bell,
} from "lucide-react";
import FriendRequestsModal from "./FriendRequestsModal";
import AddContactModal from "./AddContactModlal";
import useRequestStore from "../store/useRequestStore";

const Navbar = () => {
  const { isLoggedIn, setAccessToken } = useAuthStore();

  // State management
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { friendRequests } = useRequestStore();

  // Mock data - replace with actual data from your store
  const pendingRequestsCount = friendRequests.length; // This should come from your auth store or API

  const handleLogout = () => {
    setAccessToken(null);
    setIsMobileMenuOpen(false);
  };

  const NavButton = ({
    onClick,
    icon: Icon,
    label,
    variant = "default",
    badge = null,
  }: {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    variant?: "default" | "primary" | "danger";
    badge?: number | null;
  }) => (
    <button
      onClick={onClick}
      className={
        "relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-primary/90 shadow-sm"
      }
    >
      <div className="relative">
        <Icon className="w-4 h-4" />
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {badge}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const NavLink = ({ to, icon: Icon, label, variant = "default" }) => (
    <Link
      to={to}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200 ease-in-out
        ${
          variant === "primary"
            ? "bg-primary text-primary-content hover:bg-primary/90 shadow-sm"
            : "text-base-content/70 hover:text-base-content hover:bg-base-200 dark:hover:bg-base-300/50"
        }
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        active:scale-95
      `}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-base-300/50 bg-base-100/80 backdrop-blur-xl supports-[backdrop-filter]:bg-base-100/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <MessageSquare className="w-5 h-5 text-primary-content" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  U-Chat
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isLoggedIn && (
              <nav className="hidden md:flex items-center gap-1">
                <NavLink to="/profile" icon={User} label="Profile" />

                <NavButton
                  onClick={() => setShowAddFriend(true)}
                  icon={UserPlus}
                  label="Add Friend"
                  variant="primary"
                />

                <NavButton
                  onClick={() => setShowFriendRequests(true)}
                  icon={Users}
                  label="Requests"
                  badge={pendingRequestsCount > 0 ? pendingRequestsCount : null}
                />

                <NavLink to="/settings" icon={Settings} label="Settings" />

                <div className="w-px h-6 bg-base-300 mx-2" />

                <NavButton
                  onClick={handleLogout}
                  icon={LogOut}
                  label="Logout"
                  variant="danger"
                />
              </nav>
            )}

            {/* Mobile Menu Button */}
            {isLoggedIn && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Navigation Menu */}
          {isLoggedIn && (
            <div
              className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                isMobileMenuOpen
                  ? "max-h-96 opacity-100 pb-4"
                  : "max-h-0 opacity-0 pb-0"
              }`}
            >
              <nav className="flex flex-col gap-2 pt-4 border-t border-base-300/50">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={() => {
                    setShowAddFriend(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-primary-content hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add Friend</span>
                </button>

                <button
                  onClick={() => {
                    setShowFriendRequests(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span>Friend Requests</span>
                  </div>
                  {pendingRequestsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>

                <div className="w-full h-px bg-base-300 my-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />

      <FriendRequestsModal
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
      />

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
