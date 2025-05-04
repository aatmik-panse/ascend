"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useCallback } from "react";
import { kaushan_script } from "@/app/fonts";

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  // Throttle scroll event handling
  const lastScrollTime = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const now = Date.now();
    // Only process scroll events every 50ms
    if (now - lastScrollTime.current > 50) {
      lastScrollTime.current = now;
      if (latest > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-30 w-full", className)}
      style={{ willChange: "transform" }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <div
      className={cn(
        "relative z-30 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex transition-all duration-300 ease-out",
        visible &&
          "bg-white/80 dark:bg-neutral-950/80 transform translate-y-5 scale-95 shadow-sm backdrop-blur-sm",
        !visible && "transform translate-y-0 scale-100",
        className
      )}
      style={visible ? { minWidth: "min(800px, 90%)" } : { minWidth: "800px" }}
    >
      {children}
    </div>
  );
};

export const NavItems = React.memo(({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-300 hover:text-zinc-800 lg:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              style={{ willChange: "transform" }}
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </motion.div>
  );
});

NavItems.displayName = "NavItems";

export const MobileNav = ({ children, className, visible }) => {
  return (
    <div
      className={cn(
        "relative z-30 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-2 lg:hidden transition-all duration-300 ease-out",
        visible &&
          "bg-white/80 dark:bg-neutral-950/80 transform translate-y-5 scale-95 shadow-sm backdrop-blur-sm rounded-md",
        !visible && "transform translate-y-0 scale-100 rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-[60px] z-40 flex flex-col items-start justify-start gap-4 bg-white px-4 py-8 shadow-md dark:bg-neutral-950 transition-all duration-300",
        "max-h-[80vh] overflow-y-auto border-t border-gray-200 dark:border-gray-800",
        isOpen
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-4",
        className
      )}
      style={{
        height: isOpen ? "auto" : 0,
      }}
      aria-hidden={!isOpen}
      role="menu"
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <IconX className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={30}
        height={30}
        className="rounded-sm object-cover"
      />
      <span
        className={`font-medium ${kaushan_script.className} text-black dark:text-white`}
      >
        Certcy
      </span>
    </Link>
  );
};

export const NavbarButton = React.memo(
  ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
  }) => {
    const baseStyles =
      "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-300 inline-block text-center";

    const variantStyles = {
      primary: "shadow-md",
      secondary: "bg-transparent shadow-none dark:text-white",
      dark: "bg-black text-white shadow-md",
      gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
    };

    return (
      <Tag
        href={href || undefined}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

NavbarButton.displayName = "NavbarButton";
