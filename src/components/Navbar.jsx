"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function NewNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const navItems = [
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "Working",
      link: "/#working",
    },
    {
      name: "About",
      link: "/#about",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error checking auth status:", error);
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(!!user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {!isLoading &&
              (isLoggedIn ? (
                <NavbarButton
                  variant="primary"
                  onClick={() => handleNavigation("/dashboard")}
                  aria-label="Go to dashboard"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNavigation("/dashboard");
                  }}
                >
                  Dashboard
                </NavbarButton>
              ) : (
                <NavbarButton
                  variant="primary"
                  onClick={() => handleNavigation("/sign-up")}
                  aria-label="Get started"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNavigation("/sign-up");
                  }}
                >
                  Get Started
                </NavbarButton>
              ))}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {!isLoading &&
                (isLoggedIn ? (
                  <NavbarButton
                    onClick={() => handleNavigation("/dashboard")}
                    variant="primary"
                    className="w-full"
                  >
                    Dashboard
                  </NavbarButton>
                ) : (
                  <NavbarButton
                    onClick={() => handleNavigation("/sign-up")}
                    variant="primary"
                    className="w-full"
                  >
                    Get Started
                  </NavbarButton>
                ))}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
