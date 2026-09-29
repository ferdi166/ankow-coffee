import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import AuthStoreProvider from "@/providers/auth-store-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ankow Coffee",
  description: "Cafe & Co-Working Space",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookiesStore = await cookies();
  const profile = JSON.parse(cookiesStore.get("user_profile")?.value ?? "{}");
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body>
        <AuthStoreProvider profile={profile}>{children}</AuthStoreProvider>
      </body>
    </html>
  );
}
