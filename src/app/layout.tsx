import { Inter, Vazirmatn } from "next/font/google";
import { Metadata } from "next";

import { Toaster } from "sonner";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

import "@/styles/globals.css";

const InterFont = Inter({
  subsets: ["latin"],
  display: "swap",
});

const VazirFont = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
  authModal,
  children,
}: {
  authModal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${InterFont.className} ${VazirFont.className} antialiased font-sans`}
    >
      <body className="pt-16  bg-zinc-50 text-zinc-600">
        <Providers>
          {/* navbar */}
          <Navbar />
          {/* providers */}
          <div className="sm:px-4">
            {children}
            {authModal}
          </div>
          {/* sonner toast provider */}
          <Toaster richColors closeButton duration={4000} />
        </Providers>
      </body>
    </html>
  );
}
