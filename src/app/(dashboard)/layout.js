"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ['/layoff_risk', '/pricing'];

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const isProtectedRoute = !publicPaths.includes(pathname);

  const handleBlurClick = (e) => {
    e.preventDefault();
    router.push('/pricing');
  };

  return (
    <div className="flex min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-1 ml-24 relative">
        {isProtectedRoute && !user && (
          <div 
            onClick={handleBlurClick}
            className="absolute inset-0 backdrop-blur-md bg-black/30 z-10 flex items-center justify-center cursor-pointer"
          >
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Premium Feature</h3>
              <p className="text-gray-300">Please subscribe to access this feature</p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
