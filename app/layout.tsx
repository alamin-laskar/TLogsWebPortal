import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from "@/components/context/AuthContext";
import { ToastProvider } from "@/components/context/ToastContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Welcome to TLogs Admin Panel",
  description: "Manage your TLogs account, view analytics, and access admin features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
