"use client";

import React, { useState, useEffect } from "react";
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
  User2Icon,
  Home,
  ChevronRight,
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";
import { kaushan_script } from "@/app/fonts";

export default function SimpleSidebar({ isLoggedIn, userName, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const navItems = [
    // { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/layoff_risk", icon: Shield, label: "Layoff Risk" },
    { to: "/career_pivot", icon: Brain, label: "Career Pivot" },
    { to: "/counseling", icon: MessageSquare, label: "Counseling" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const avatarUrl = isLoggedIn ? user?.user_metadata?.avatar_url : null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-blue-500/10 shadow-xl z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/"
            className="p-4 flex items-center justify-center h-20 border-b border-blue-500/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span
              className={`text-xl font-bold bg-gradient-to-r text-blue-500 bg-clip-text ${kaushan_script.className}`}
            >
              C
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex-1 py-8 flex flex-col items-center space-y-6">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive =
                pathname === to || (to === "/dashboard" && pathname === "/");

              return (
                <Link
                  key={to}
                  href={to}
                  aria-label={label}
                  tabIndex="0"
                  className={`relative group p-3 rounded-xl transition-all duration-300 flex items-center justify-center w-12 h-12 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-600/20 to-indigo-600/10 text-blue-400"
                      : "text-zinc-500 hover:text-blue-400 hover:bg-zinc-800/30"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(to);
                    }
                  }}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "drop-shadow-[0_0_3px_rgba(96,165,250,0.5)]"
                        : ""
                    }`}
                  />

                  {/* Tooltip */}
                  <div className="absolute left-16 origin-left scale-95 opacity-0 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-3 py-2 rounded-lg border border-blue-500/10 shadow-xl group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-10 flex items-center gap-1.5">
                    <span className="text-sm font-medium">{label}</span>
                    <ChevronRight className="h-3 w-3 text-zinc-400" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Profile/Auth */}
          <div className="p-4 border-t border-blue-500/10 flex items-center justify-center">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  aria-label="Account menu"
                  aria-expanded={showProfileMenu}
                  aria-haspopup="menu"
                  className="p-1 rounded-full transition-all duration-300 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-md border border-blue-500/10 hover:border-blue-500/30 group"
                  tabIndex="0"
                >
                  {avatarUrl ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                      <img
                        src={avatarUrl}
                        alt={`${userName || "User"}'s avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-300" />
                    </div>
                  )}
                </button>

                {/* Profile popup menu */}
                {showProfileMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-blue-500/10 overflow-hidden shadow-lg z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-blue-500/10 bg-zinc-800/50 backdrop-blur-sm">
                      <p className="text-sm font-medium text-white truncate">
                        {userName || "Account"}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {user?.email || "Signed in"}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                      tabIndex={showProfileMenu ? "0" : "-1"}
                    >
                      <User className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      tabIndex={showProfileMenu ? "0" : "-1"}
                      aria-label="Sign out"
                      className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-red-400 transition-colors"
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
                  aria-label="Login options"
                  aria-expanded={showLoginOptions}
                  aria-haspopup="menu"
                  tabIndex="0"
                  className="p-3 rounded-full transition-all duration-300 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-md border border-blue-500/10 hover:border-blue-500/30 hover:text-blue-300"
                >
                  <User2Icon className="h-5 w-5 text-zinc-400" />
                </button>

                {/* Login options popup */}
                {showLoginOptions && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-blue-500/10 overflow-hidden shadow-lg z-20 animate-fade-in">
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                      onClick={() => setShowLoginOptions(false)}
                      tabIndex={showLoginOptions ? "0" : "-1"}
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                      onClick={() => setShowLoginOptions(false)}
                      tabIndex={showLoginOptions ? "0" : "-1"}
                    >
                      <User2Icon className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-blue-500/10 flex items-center justify-between px-4 z-40 backdrop-blur-sm">
        <Link href="/" className="flex items-center">
          <span
            className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text ${kaushan_script.className}`}
          >
            Certcy
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                aria-label="Account menu"
                aria-expanded={showProfileMenu}
                aria-haspopup="menu"
                tabIndex="0"
                className="p-1 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-blue-500/10 transition-all"
              >
                {avatarUrl ? (
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-500/20">
                    <img
                      src={avatarUrl}
                      alt={`${userName || "User"}'s avatar`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-300" />
                  </div>
                )}
              </button>

              {/* Mobile profile popup menu */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-blue-500/10 overflow-hidden shadow-lg z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-blue-500/10 bg-zinc-800/50">
                    <p className="text-sm font-medium text-white truncate">
                      {userName || "Account"}
                    </p>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {user?.email || "Signed in"}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                    tabIndex={showProfileMenu ? "0" : "-1"}
                  >
                    <User className="h-4 w-4" />
                    <span>My Account</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    tabIndex={showProfileMenu ? "0" : "-1"}
                    aria-label="Sign out"
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-red-400 transition-colors"
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
                aria-label="Login options"
                aria-expanded={showLoginOptions}
                aria-haspopup="menu"
                tabIndex="0"
                className="p-2 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-blue-500/10 text-zinc-400 hover:text-blue-300 transition-all"
              >
                <User2Icon className="h-5 w-5" />
              </button>

              {/* Mobile login options */}
              {showLoginOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-blue-500/10 overflow-hidden shadow-lg z-50 animate-fade-in">
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                    onClick={() => setShowLoginOptions(false)}
                    tabIndex={showLoginOptions ? "0" : "-1"}
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 hover:text-blue-300 transition-colors"
                    onClick={() => setShowLoginOptions(false)}
                    tabIndex={showLoginOptions ? "0" : "-1"}
                  >
                    <User2Icon className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            tabIndex="0"
            className="p-2 rounded-lg hover:bg-zinc-800/70 text-zinc-400 hover:text-blue-300 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed top-16 right-0 bottom-0 w-72 bg-gradient-to-b from-zinc-900 to-zinc-950 border-l border-blue-500/10 z-50 md:hidden shadow-xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex-1 py-6 px-4">
                <div className="space-y-2">
                  {navItems.map(({ to, icon: Icon, label }) => {
                    const isActive =
                      pathname === to ||
                      (to === "/dashboard" && pathname === "/");

                    return (
                      <Link
                        key={to}
                        href={to}
                        onClick={() => setMobileMenuOpen(false)}
                        tabIndex={mobileMenuOpen ? "0" : "-1"}
                        aria-label={label}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/5 text-blue-400"
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-blue-400"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-blue-950/50" : "bg-zinc-800/30"
                          } flex-shrink-0`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isActive ? "text-blue-400" : "text-zinc-400"
                            }`}
                          />
                        </div>
                        <span className="font-medium">{label}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-auto text-blue-300/50" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-blue-500/10 space-y-3">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 bg-zinc-800/30 rounded-lg mb-3">
                      <p className="text-sm font-medium text-white">
                        {userName || "Account"}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      tabIndex={mobileMenuOpen ? "0" : "-1"}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      tabIndex={mobileMenuOpen ? "0" : "-1"}
                      aria-label="Sign out"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-colors"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/sign-in"
                        className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        tabIndex={mobileMenuOpen ? "0" : "-1"}
                      >
                        Login
                      </Link>
                      <Link
                        href="/sign-up"
                        className="flex items-center justify-center px-4 py-3 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        tabIndex={mobileMenuOpen ? "0" : "-1"}
                      >
                        Sign Up
                      </Link>
                    </div>
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
