import ClientWrapper from "../components/ClientWrapper";
import "./globals.css";

export const metadata = {
  title: "CarRental | Elite Vehicle Fleet",
  description: "Experience the extraordinary with our curative fleet of high-performance luxury vehicles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
