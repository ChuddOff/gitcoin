import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import Footer from "@/components/footer/Footer";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "../trpc/react";
import NextAuthProvider from "./provider/NextAuth";
import HeaderWrapper from "@/components/header/HeaderWrapper";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoinGit",
  description: "Трейдинг только тут 👨‍💻",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollbarColor: "#7b7b7b #424242" }}>
      <body className={montserrat.className}>
        <TRPCReactProvider>
          <NextAuthProvider>
            <NextUIProvider>
              <NextThemesProvider attribute="class" defaultTheme="light">
                <HeaderWrapper />
                {children}
                <Footer />
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName=""
                />
              </NextThemesProvider>
            </NextUIProvider>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
