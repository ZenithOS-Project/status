import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Status Page",
  description: "System status monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="max-h-screen min-h-screen max-w-screen min-w-screen overflow-hidden bg-[url('/defaultBackground.jpg')] bg-cover bg-center">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
