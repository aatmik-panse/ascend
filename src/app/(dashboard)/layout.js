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
      <main className="">
        {children}
      </main>
    </div>
  );
}
