import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { NextUIProvider } from "@nextui-org/react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeSave",
  description:
    "охраните свои лучшие строки кода и поделитесь ими с другими разработчиками",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={montserrat.className}>
          <NextUIProvider>
            <Header />
            {children}
            <Footer />
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
