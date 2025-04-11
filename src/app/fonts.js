import {
  Kaushan_Script,
  DM_Serif_Display,
  Space_Grotesk,
} from "next/font/google";

export const kaushan_script = Kaushan_Script({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kaushan_script",
});

export const dm_serif_display = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif-display",
  style: ["normal", "italic"],
});

export const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  // Available weights: 300, 400, 500, 600, 700
  weight: ["300", "400", "500", "600", "700"],
});
