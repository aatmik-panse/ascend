"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Brain, Network, CreditCard, MessageSquare, User, Settings, ChevronRight, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(login)/actions';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { to: '/layoff_risk', icon: Shield, label: 'Layoff Risk' },
    { to: '/career_pivot', icon: Brain, label: 'Career Pivot' },
    { to: '/networking', icon: Network, label: 'Networking' },
    { to: '/counseling', icon: MessageSquare, label: 'Counseling' },
    { to: '/pricing', icon: CreditCard, label: 'Pricing' },
  ];

  const toggleExpand = () => {
    if (!isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const NavContent = () => (
    <>
      <div className="flex-1 py-6 px-3 ">
        <div className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                href={to}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-[var(--color-periwinkle)]/20 to-[var(--color-lilac)]/10 text-[var(--color-periwinkle)] font-medium' 
                    : 'text-gray-400 hover:bg-gray-800/70 hover:text-[var(--color-lilac)]'
                  }
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-[var(--color-periwinkle)]' : 'group-hover:text-[var(--color-lilac)]'}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                  isExpanded || mobileMenuOpen ? 'opacity-100 w-auto' : 'w-0 opacity-0'
                }`}>
                  {label}
                </span>
                {!isExpanded && !mobileMenuOpen && (
                  <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm whitespace-nowrap z-10">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-[var(--color-periwinkle)]/20">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-[var(--color-lilac)] transition-all duration-200 ${
              showProfileMenu ? 'bg-gray-800/70 text-[var(--color-lilac)]' : ''
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--color-periwinkle)]/40 to-[var(--color-lilac)]/30 flex items-center justify-center flex-shrink-0 shadow-md">
              <User className="h-5 w-5" />
            </div>
            {(isExpanded || mobileMenuOpen) && (
              <div className="flex-1 text-left">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-400">Premium Plan</p>
              </div>
            )}
            {(isExpanded || mobileMenuOpen) && (
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
                showProfileMenu ? 'rotate-90' : ''
              }`} />
            )}
          </button>

          {showProfileMenu && (isExpanded || mobileMenuOpen) && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg border border-[var(--color-periwinkle)]/20 overflow-hidden shadow-lg">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button onClick={handleSignOut}  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-[var(--color-lilac)] transition-colors cursor-pointer">
                <LogOut 
                  className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors" 
                  
                />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] border-b border-[var(--color-periwinkle)]/20 flex items-center justify-between px-4 z-40">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-periwinkle)] to-[var(--color-lilac)] bg-clip-text text-transparent">
              ascend.
            </span>
          </Link>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile sidebar that slides in */}
        <div className={`fixed top-16 right-0 bottom-0 w-64 bg-[#0f0f0f] border-l border-[var(--color-periwinkle)]/20 z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <NavContent />
        </div>
        
        {/* Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop view
  return (
    <nav 
      className={`fixed left-0 top-0 h-screen bg-[#0f0f0f] border-r border-[var(--color-periwinkle)]/20 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      } z-40 shadow-xl`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setShowProfileMenu(false);
      }}
    >
      <div className="p-5 border-b border-[var(--color-periwinkle)]/20 flex items-center justify-center">
        <Link href="/" className="flex items-center justify-center">
          <span className={`text-2xl font-bold bg-gradient-to-r from-[var(--color-periwinkle)] to-[var(--color-lilac)] bg-clip-text text-transparent transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'w-0 opacity-0'
          }`}>
            ascend.
          </span>
          <span className={`text-2xl font-bold bg-gradient-to-r from-[var(--color-periwinkle)] to-[var(--color-lilac)] bg-clip-text text-transparent transition-all duration-300 ${
            isExpanded ? 'w-0 opacity-0' : 'opacity-100'
          }`}>
            a.
          </span>
        </Link>
      </div>
      <NavContent />
    </nav>
  );
};

export default Navbar;