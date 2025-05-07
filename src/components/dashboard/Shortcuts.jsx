import React from "react";
import Link from "next/link";
import { Rocket, MessageCircle, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const shortcuts = [
  {
    name: "Resume Booster",
    icon: <Rocket className="h-5 w-5" />,
    href: "/tools/resume-enhancer",
    aria: "Open Resume Booster",
  },
  {
    name: "Chat with Coach",
    icon: <MessageCircle className="h-5 w-5" />,
    href: "/counseling",
    aria: "Chat with your career coach",
  },
  {
    name: "Explore Pivots",
    icon: <Briefcase className="h-5 w-5" />,
    href: "/career_pivot",
    aria: "Explore pivot roles",
  },
];

export function Shortcuts({ className }) {
  return (
    <div className={cn("card-gradient p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-500">🚀</span>
        <h3 className="text-xl font-bold text-white">Shortcuts</h3>
      </div>
      <p className="text-sm text-zinc-400 mb-5">Quick access to tools</p>

      <div className="space-y-3">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.name}
            href={shortcut.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-white"
            aria-label={shortcut.aria}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter") window.location.href = shortcut.href;
            }}
          >
            <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center text-green-500">
              {shortcut.icon}
            </div>
            <span>{shortcut.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
