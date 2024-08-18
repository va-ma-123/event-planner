// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from '@/components/nav';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Planner",
  description: "Plan and manage events, track details and get real-time weather forecasts.",
  openGraph: {
    title: "Event Planner",
    description: "A platform to plan and manage events, track details and get real-time weather forecasts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="theme-color" content="#317EFB" />
      </head>
      <body className={`{inter.className} dark:bg-gray-900 dark:text-white`}>
        {/* <AuthProvider> */}
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
