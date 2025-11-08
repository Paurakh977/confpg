import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftBar from "../components/Leftbar";
import RightBar from "../components/Rightbar";
import { SearchProvider } from "@/context/SearchContext"; // context provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KU Confessions",
  description: "Kathmandu University Confessions Platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-black text-white ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          {/* Full-page layout with fixed sidebars and scrollable main content */}
          <div className="flex h-screen overflow-hidden">
            {/* Left Sidebar (fixed width) */}
            <div className="w-72 flex-shrink-0 border-r border-white/10 overflow-y-auto">
              <LeftBar />
            </div>

            {/* Main Content (scrollable only here) */}
            <main className="flex-1 overflow-y-auto border-r border-white/10 p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {children}
            </main>

            {/* Right Sidebar (fixed width) */}
            <div className="w-80 flex-shrink-0 p-4 overflow-y-auto border-l border-white/10">
              <RightBar />
            </div>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
