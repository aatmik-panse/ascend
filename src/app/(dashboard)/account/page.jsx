"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Edit2,
  Camera,
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";
import { motion } from "framer-motion";
import { getUser } from "@/queries/user";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    avatarUrl: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const supabase = createClient();

      try {
        // Get authenticated user
        const user = await getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        setUser(user);

        console.log("User:", user);
        const userData = user?.user_metadata;
        console.log("User Data:", userData);

        if (userData) {
          setProfileData({
            fullName: userData.full_name || "",
            email: user.email || "",
            avatarUrl: userData.avatar_url,
          });

          if (userData.avatar_url) {
            setImageSrc(userData.avatar_url);
          }
        } else {
          setProfileData({
            ...profileData,
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error loading account data:", error);
        showNotification(
          "Error loading account data. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase storage
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) throw error;

      const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/s3/public/avatars/${fileName}`;

      // Update profile data with new avatar URL
      setProfileData({
        ...profileData,
        avatarUrl,
      });

      showNotification("Profile picture updated successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification("Failed to upload image. Please try again.", "error");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Update user metadata with only the allowed fields
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
        },
      });

      if (error) throw error;

      setIsEditing(false);
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white" />
            )}
            <p className="text-white">{notification.message}</p>
          </div>
        </motion.div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-200 dark:text-gray-400">
          Manage your personal account information
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
            <button
              onClick={handleEditToggle}
              className="flex items-center text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              tabIndex="0"
              aria-label={isEditing ? "Cancel editing" : "Edit profile"}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditToggle();
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer transition-all duration-200 shadow-lg"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        document.getElementById("avatar-upload").click();
                    }}
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {profileData.fullName || "Your Name"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {profileData.email}
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="mt-6 flex items-center text-sm px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                tabIndex="0"
                aria-label="Sign out"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignOut();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 focus:outline-none"
                    placeholder="your@email.com"
                    disabled={true}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center text-sm font-medium px-6 py-2.5 rounded-lg bg-black hover:bg-gray-800 text-white transition-colors"
                    tabIndex="0"
                    aria-label="Save profile changes"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveProfile();
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
