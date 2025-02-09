import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "../components/Navigation"
import { AIChat } from "../components/AIChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel App",
  description: "Plan your trips with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <AIChat />
      </body>
    </html>
  )
}
