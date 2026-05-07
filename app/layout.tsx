import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./tailwind.css";
import Provider from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anti-Corruption",
  description: "E-learning anti corruption",
  icons: { icon: "/assets/sosal.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}