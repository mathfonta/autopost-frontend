import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoPost — Publique no Instagram automaticamente",
  description: "Dashboard para gerenciar e aprovar posts automáticos no Instagram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
          <ToastProvider>
            <ServiceWorkerRegistrar />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
