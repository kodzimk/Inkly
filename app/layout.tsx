import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const CLIENT_ID = '393105490411-376mj2475c8pkib09es78950lr8dv8ef.apps.googleusercontent.com';

export const metadata: Metadata = {
  title: "Inkly - Find Peace in Your Thoughts",
  description: "Capture ideas, reflect on experiences, and organize your mind in this tranquil digital space.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden overflow-y-auto`}
      >
        {children}
        <Toaster />
      </body>
    </html>
    </GoogleOAuthProvider>
  );
}
