import { Outfit } from "next/font/google";
import ClientWrapper from "../components/ClientWrapper";
import ChatbotWidget from "../components/ChatbotWidget";

import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "CarRental | Elite Vehicle Fleet",
  description: "Experience the extraordinary with our curative fleet of high-performance luxury vehicles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>

        <ClientWrapper>
          {children}
          <ChatbotWidget />
        </ClientWrapper>
      </body>
    </html>
  );
}
