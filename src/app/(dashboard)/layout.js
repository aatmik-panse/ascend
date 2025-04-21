"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import SimpleSidebar from "@/components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Routes accessible without authentication
  const publicPaths = ["/layoff_risk", "/pricing"];
  const isProtectedRoute = !publicPaths.includes(pathname);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        setUser(user);

        // Redirect if trying to access protected route without auth
        if (isProtectedRoute && !user) {
          router.push("/sign-in");
          return;
        }

        // Get the user's name if they are logged in
        if (user) {
          const userData = user?.user_metadata;
          // Use full_name if available, otherwise use email or default to "User"
          setUserName(userData?.full_name || user.email || "User");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [isProtectedRoute, router, pathname]);

  // Determine current page name for breadcrumbs
  const getPageName = () => {
    const path = pathname.split("/").pop();
    return path
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const currentPage = pathname !== "/" ? getPageName() : "Dashboard";

  // Handle pricing navigation
  const handlePricingClick = (e) => {
    e.preventDefault();
    router.push("/pricing");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-blue-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 min-h-screen flex">
      {/* Sidebar */}
      <SimpleSidebar isLoggedIn={!!user} userName={userName} user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-16">
        {/* Breadcrumb & Page Header */}
        <header className="sticky top-0 z-30 bg-zinc-900/80 backdrop-blur-sm border-b border-white/5 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between gap-2">
              <div>
                <nav className="flex items-center text-sm text-zinc-400">
                  <a
                    href="/dashboard"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Dashboard
                  </a>
                  {pathname !== "/dashboard" && (
                    <>
                      <span className="mx-2">/</span>
                      <span className="text-blue-400 font-medium">
                        {currentPage}
                      </span>
                    </>
                  )}
                </nav>
                <h1 className="text-xl font-medium text-white mt-1">
                  {currentPage}
                </h1>
              </div>

              {!user && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 md:p-6 relative"
          >
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23fff'/%3E%3C/svg%3E")`,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto">
              {/* Blur effect if not logged in on protected routes */}
              {isProtectedRoute && !user ? (
                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-md bg-zinc-900/60 z-10 flex flex-col items-center justify-center p-6">
                    <h3 className="text-xl font-medium text-white mb-4">
                      Sign in to access this feature
                    </h3>
                    <p className="text-zinc-300 text-center max-w-md mb-6">
                      You need to be signed in to view and use this feature.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push("/sign-in")}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handlePricingClick}
                        className="px-4 py-2 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                      >
                        View Pricing
                      </button>
                    </div>
                  </div>
                  <div className="opacity-30 filter blur-sm pointer-events-none">
                    {children}
                  </div>
                </div>
              ) : (
                <div>{children}</div>
              )}
            </div>
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-white/5 px-4 md:px-6 py-3 text-xs text-zinc-500 text-center">
          <div className="max-w-7xl mx-auto">
            © {new Date().getFullYear()} Certcy. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
