import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import { PosthogProvider } from "@/components/providers/PosthogProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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
    <html lang="pt-BR" className={`${jakarta.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full bg-gray-50">
        <div className="mx-auto flex min-h-full w-full max-w-107.5 flex-col">
          <AuthProvider>
            <PosthogProvider>
              <ToastProvider>
                <ServiceWorkerRegistrar />
                {children}
              </ToastProvider>
            </PosthogProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
