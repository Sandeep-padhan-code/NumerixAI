import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NumerixAI",
  description: "Private AI engineering mathematics solver."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
