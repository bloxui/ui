import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bloxui-kit.vercel.app"),
  title: "Blox UI",
  description: "Accessible React components you copy into your project and own. Built on Tailwind CSS v4 and Radix.",
  openGraph: {
    type: "website",
    siteName: "Blox UI",
    title: "Blox UI",
    description: "Accessible React components you copy into your project and own.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
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
