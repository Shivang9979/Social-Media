import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev Social Media App",
  description: "Social media app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} bg-slate-100` }><div className="w-full px-4 bg-white lg:px-16 md:px-8 xl:px-32 ">
        <Navbar/>
        </div>
        <div className="bg-slate-100 px-4 lg:px-16 md:px-8 xl:px-32 ">
          {children}
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}