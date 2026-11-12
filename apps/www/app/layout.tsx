import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blox UI",
  description: "Crafted React components you own.",
};

// Applies the saved theme before paint so the page does not flash.
const themeScript = `try{var t=localStorage.getItem("blox-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
