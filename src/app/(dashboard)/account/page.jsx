"use client";
import React, { useState, useEffect, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  Shield,
  LogOut,
  CheckCircle,
  AlertCircle,
  Edit2,
  Upload,
  Camera,
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";
import { motion } from "framer-motion";
import { getUser } from "@/queries/user";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    avatarUrl: null,
    jobTitle: "",
    company: "",
    bio: "",
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

        // if (authError) throw authError;
        if (!user) {
          router.push("/sign-in");
          return;
        }

        setUser(user);

        // // Fetch user profile data from users table
        // const { data: userData, error: profileError } = await supabase
        //   .from("users")
        //   .select("*")
        //   .eq("id", user.id)
        //   .single();

        // if (profileError && profileError.code !== "PGRST116") {
        //   console.error("Error fetching profile:", profileError);
        // }
        console.log("User:", user);
        const userData = user?.user_metadata;
        console.log("User Data:", userData);

        if (userData) {
          setProfileData({
            fullName: userData.full_name || "",
            email: user.email || "",
            avatarUrl: userData.avatar_url,
            jobTitle: userData.job_title || "",
            company: userData.company || "",
            bio: userData.bio || "",
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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

      const { error } = await supabase
        .from("users")
        .update({
          full_name: profileData.fullName,
          job_title: profileData.jobTitle,
          company: profileData.company,
          bio: profileData.bio,
          avatar_url: profileData.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account</h1>
        <p className="text-zinc-400">View and manage your account settings</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "text-blue-400 border-b-2 border-blue-500 bg-blue-900/10"
                  : "text-zinc-400 hover:text-blue-300 hover:bg-blue-900/5"
              }`}
              tabIndex="0"
              aria-label={`${tab.label} tab`}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTabChange(tab.id);
              }}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-zinc-900/50 rounded-xl shadow-lg border border-zinc-800/50 overflow-hidden">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Profile Information
              </h2>
              <button
                onClick={handleEditToggle}
                className="flex items-center text-sm font-medium px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
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
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-2 border-blue-500/30">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-zinc-600" />
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
                  <h3 className="font-semibold text-lg text-white">
                    {profileData.fullName || "Your Name"}
                  </h3>
                  <p className="text-zinc-400 text-sm">{profileData.email}</p>
                </div>

                <button
                  onClick={handleSignOut}
                  className="mt-6 flex items-center text-sm px-4 py-2 rounded-lg bg-red-950/30 hover:bg-red-950/50 text-red-300 transition-colors"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-zinc-400 mb-1"
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
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-zinc-400 mb-1"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-400 focus:outline-none"
                      placeholder="your@email.com"
                      disabled={true}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-zinc-400 mb-1"
                      htmlFor="jobTitle"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Product Manager"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-zinc-400 mb-1"
                      htmlFor="company"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Google"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="A brief description about yourself"
                    disabled={!isEditing}
                  ></textarea>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center text-sm font-medium px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-900/20 transition-colors"
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
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Subscription Details
            </h2>

            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/20 rounded-lg p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="bg-blue-600/20 text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded">
                    CURRENT PLAN
                  </span>
                  <h3 className="text-xl font-medium text-white mt-1">
                    Pro Plan
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Billed monthly · Renews on May 21, 2025
                  </p>
                </div>
                <div>
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Advanced risk analysis",
                  "Personalized career roadmap",
                  "Automated networking",
                  "Priority support",
                  "Resume optimization",
                  "Job market insights",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Payment Method
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-14 bg-gradient-to-r from-slate-600 to-slate-800 rounded-md flex items-center justify-center text-white font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="text-zinc-300">**** **** **** 4242</p>
                    <p className="text-xs text-zinc-500">Expires 12/27</p>
                  </div>
                  <button className="ml-auto text-sm text-blue-400 hover:text-blue-300">
                    Edit
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Billing History
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-zinc-800/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {[
                        {
                          date: "Apr 21, 2025",
                          amount: "$29.00",
                          status: "Paid",
                        },
                        {
                          date: "Mar 21, 2025",
                          amount: "$29.00",
                          status: "Paid",
                        },
                        {
                          date: "Feb 21, 2025",
                          amount: "$29.00",
                          status: "Paid",
                        },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-zinc-300">
                            {item.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-300">
                            {item.amount}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-green-900/20 text-green-400 text-xs px-2 py-1 rounded">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-sm text-blue-400 hover:text-blue-300">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Notification Settings
            </h2>

            {[
              "Email Notifications",
              "Browser Notifications",
              "SMS Notifications",
            ].map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="text-lg font-medium text-white mb-4">
                  {section}
                </h3>
                <div className="space-y-4">
                  {[
                    "Career insights and updates",
                    "Risk assessment alerts",
                    "New opportunities matching your profile",
                    "Product updates and news",
                  ].map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <span className="text-zinc-300">{item}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={sectionIndex !== 2}
                        />
                        <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-600/30 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Language & Region
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="language"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="timezone"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="utc-8">Pacific Time (UTC-8)</option>
                    <option value="utc-5">Eastern Time (UTC-5)</option>
                    <option value="utc">UTC</option>
                    <option value="utc+1">Central European Time (UTC+1)</option>
                    <option value="utc+8">China Standard Time (UTC+8)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6 mt-6">
              <h3 className="text-lg font-medium text-red-500 mb-4">
                Danger Zone
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button className="px-4 py-2 bg-red-950/30 hover:bg-red-950/50 text-red-400 rounded-lg text-sm transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Security Settings
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a new password"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-zinc-400 mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your new password"
                  />
                </div>

                <div>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Two-Factor Authentication
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>
              <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors">
                Enable Two-Factor Authentication
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-6 mt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Login Sessions
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                These are devices that have logged into your account. Revoke any
                sessions that you do not recognize.
              </p>
              <div className="space-y-4">
                {[
                  {
                    device: "MacBook Pro",
                    location: "San Francisco, CA",
                    time: "Current session",
                    current: true,
                  },
                  {
                    device: "iPhone 14 Pro",
                    location: "San Francisco, CA",
                    time: "2 days ago",
                    current: false,
                  },
                  {
                    device: "Windows PC",
                    location: "Chicago, IL",
                    time: "1 week ago",
                    current: false,
                  },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {session.device}{" "}
                        {session.current && (
                          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded ml-2">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {session.location} • {session.time}
                      </p>
                    </div>
                    {!session.current && (
                      <button className="text-sm text-red-400 hover:text-red-300">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
