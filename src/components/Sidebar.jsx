"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  Brain,
  Network,
  CreditCard,
  MessageSquare,
  User,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";

export default function SimpleSidebar({ isLoggedIn }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const navItems = [
    { to: "/layoff_risk", icon: Shield, label: "Layoff Risk" },
    { to: "/career_pivot", icon: Brain, label: "Career Pivot" },
    { to: "/networking", icon: Network, label: "Networking" },
    { to: "/counseling", icon: MessageSquare, label: "Counseling" },
    { to: "/pricing", icon: CreditCard, label: "Pricing" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
      setShowLoginOptions(false);
    };

    if (showProfileMenu || showLoginOptions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showProfileMenu, showLoginOptions]);

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
    setShowLoginOptions(false);
  };

  const toggleLoginOptions = (e) => {
    e.stopPropagation();
    setShowLoginOptions(!showLoginOptions);
    setShowProfileMenu(false);
  };

  const avatarUrl = isLoggedIn ? "/default-avatar.png" : null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-16 bg-[#0f0f0f] border-r border-[var(--color-periwinkle)]/20 shadow-xl z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/"
            className="p-4 flex items-center justify-center border-b border-[var(--color-periwinkle)]/20"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-periwinkle)] to-[var(--color-lilac)] bg-clip-text text-transparent">
              C
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex-1 py-6 flex flex-col items-center space-y-4">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = pathname === to;

              return (
                <Link
                  key={to}
                  href={to}
                  className={`relative group p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-[var(--color-periwinkle)] bg-[var(--color-periwinkle)]/10"
                      : "text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Profile/Auth */}
          <div className="p-4 border-t border-[var(--color-periwinkle)]/20 flex items-center justify-center">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="p-1 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  {avatarUrl ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-[var(--color-periwinkle)]/30">
                      <img
                        src={avatarUrl}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--color-periwinkle)]/40 to-[var(--color-lilac)]/30 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                    Account
                  </span>
                </button>

                {/* Profile popup menu */}
                {showProfileMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg border border-[var(--color-periwinkle)]/20 overflow-hidden shadow-lg z-20">
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleLoginOptions}
                  className="p-3 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 transition-all duration-200 group relative"
                >
                  <User className="h-5 w-5" />
                  <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                    Sign In
                  </span>
                </button>

                {/* Login options popup */}
                {showLoginOptions && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg border border-[var(--color-periwinkle)]/20 overflow-hidden shadow-lg z-20">
                    <Link
                      href="/sign-in"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Standard Login</span>
                    </Link>
                    <Link
                      href="/sign-in/google"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                      </svg>
                      <span>Google Login</span>
                    </Link>
                    <Link
                      href="/sign-in/github"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                        />
                      </svg>
                      <span>GitHub Login</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] border-b border-[var(--color-periwinkle)]/20 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-periwinkle)] to-[var(--color-lilac)] bg-clip-text text-transparent">
            Certcy
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="p-1 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 transition-all"
              >
                {avatarUrl ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-[var(--color-periwinkle)]/30">
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--color-periwinkle)]/40 to-[var(--color-lilac)]/30 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </button>

              {/* Mobile profile popup menu */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-[var(--color-periwinkle)]/20 overflow-hidden shadow-lg z-50">
                  <Link
                    href="/account"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>My Account</span>
                  </Link>
                  <Link
                    href="/account/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={toggleLoginOptions}
                className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 transition-all"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Mobile login options */}
              {showLoginOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-[var(--color-periwinkle)]/20 overflow-hidden shadow-lg z-50">
                  <Link
                    href="/sign-in"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Standard Login</span>
                  </Link>
                  <Link
                    href="/sign-in/google"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    <span>Google Login</span>
                  </Link>
                  <Link
                    href="/sign-in/github"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                    <span>GitHub Login</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-[#0f0f0f] border-l border-[var(--color-periwinkle)]/20 z-50 md:hidden transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex-1 py-6 px-4">
                <div className="space-y-3">
                  {navItems.map(({ to, icon: Icon, label }) => {
                    const isActive = pathname === to;

                    return (
                      <Link
                        key={to}
                        href={to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[var(--color-periwinkle)]/20 to-[var(--color-lilac)]/10 text-[var(--color-periwinkle)]"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-[var(--color-lilac)]"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-[var(--color-periwinkle)]/20">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span>My Account</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800/50"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span>Standard Login</span>
                    </Link>
                    <Link
                      href="/sign-in/google"
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                      </svg>
                      <span>Google Login</span>
                    </Link>
                    <Link
                      href="/sign-in/github"
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                        />
                      </svg>
                      <span>GitHub Login</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
