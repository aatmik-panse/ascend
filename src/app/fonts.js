import { Kaushan_Script, Playfair_Display } from "next/font/google";

export const kaushan_script = Kaushan_Script({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kaushan_script",
});

export const playfair_display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  // Available weights: 400, 500, 600, 700, 800, 900
  weight: ["400", "500", "600", "700", "800", "900"],
});
