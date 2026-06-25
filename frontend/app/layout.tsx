import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Layout";
import { ChatbotWidget } from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Amen Bank - Your Trusted Financial Partner",
  description: "Banking solutions for individuals and businesses in Tunisia. 40+ years of trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <Header />
        <main className="grow">{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}