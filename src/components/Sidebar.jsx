"use client";

import React from "react";
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
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";

export default function SimpleSidebar({ isLoggedIn }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
              <button
                onClick={handleSignOut}
                className="p-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800/50 transition-all duration-200 group relative"
              >
                <User className="h-5 w-5" />
                <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                  Sign Out
                </span>
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="p-3 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50 transition-all duration-200 group relative"
              >
                <User className="h-5 w-5" />
                <span className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                  Sign In
                </span>
              </Link>
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
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
        >
          <Menu className="h-6 w-6" />
        </button>
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
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800/50"
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-[var(--color-lilac)] hover:bg-gray-800/50"
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
