import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  Camera,
  Edit2,
  Mail,
  Clock,
  User,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserProfile {
  email: string;
  fullname: string;
  profilePicture: string;
  coverPicture: string;
  bio: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

const Profile = () => {
  const { accessToken } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile when component mounts or when accessToken changes
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [accessToken]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/profile");
      console.log("Profile response:", response.data);
      setProfile(response.data.profile);
      setEditedBio(response.data.profile.bio || "");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to load profile";
      toast.error(errorMessage);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBio = async () => {
    if (!editedBio.trim()) {
      toast.error("Bio cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.patch("/auth/profile", {
        updates: { bio: editedBio.trim() }
      });
      
      // Update profile state with new data
      if (response.data.profile) {
        setProfile(response.data.profile);
      } else {
        // If profile not in response, update the bio manually
        setProfile(prev => prev ? { ...prev, bio: editedBio.trim() } : null);
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      // Reset edited bio to original value on error
      setEditedBio(profile?.bio || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (type: "profile" | "cover", file: File) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.patch(`/auth/profile/${type}-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data.profile) {
        setProfile(response.data.profile);
      } else {
        // If no profile in response, refetch to get updated data
        await fetchProfile();
      }
      
      toast.success(`${type === "profile" ? "Profile" : "Cover"} picture updated`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update picture";
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedBio(profile?.bio || "");
  };

  const formatLastSeen = (lastSeen: string) => {
    try {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Profile not found</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80">
        <div
          className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600"
          style={{
            backgroundImage: profile.coverPicture ? `url(${profile.coverPicture})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <label
            htmlFor="cover-upload"
            className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full cursor-pointer hover:bg-background/90 transition-colors shadow-lg"
          >
            <Camera className="w-5 h-5 text-foreground" />
            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload("cover", file);
                  // Reset the file input
                  e.target.value = '';
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 sm:-mt-20">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 shadow-xl">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.fullname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-white/80" />
              </div>
            )}
          </div>
          <label
            htmlFor="profile-upload"
            className="absolute bottom-2 right-2 p-2 bg-background backdrop-blur-sm rounded-full cursor-pointer hover:bg-background/90 transition-colors shadow-lg border border-border"
          >
            <Camera className="w-5 h-5 text-foreground" />
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload("profile", file);
                  // Reset the file input
                  e.target.value = '';
                }
              }}
            />
          </label>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-6">
          {/* Name and Status */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {profile.fullname}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {profile.isOnline ? (
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    Last seen {formatLastSeen(profile.lastSeen)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <span>{profile.email}</span>
          </div>

          {/* Bio */}
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">About</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Edit bio"
                >
                  <Edit2 className="w-5 h-5 text-muted-foreground" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveBio}
                    disabled={isSaving}
                    className="p-2 hover:bg-green-500/10 rounded-lg transition-colors text-green-500 disabled:opacity-50"
                    title="Save changes"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 disabled:opacity-50"
                    title="Cancel editing"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full h-32 p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Write something about yourself..."
                  maxLength={500}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {editedBio.length}/500
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {profile.bio || "No bio yet. Click the edit button to add one!"}
              </p>
            )}
          </div>

          {/* Member Since */}
          <div className="text-sm text-muted-foreground">
            Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;