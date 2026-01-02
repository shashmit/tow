import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AuthProvider } from "@/components/providers/auth-context";
import { AlertProvider } from "@/components/providers/alert-context";


const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tow",
  description: "Fresh take on tutoring, a platform for tutors and students to connect and learn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${jakarta.variable} antialiased font-sans bg-background text-foreground`}
      >
        <AuthProvider>
          <AlertProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
