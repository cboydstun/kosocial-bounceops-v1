import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "KO Rental Software - Bounce House Business Management",
  description: "Professional software for managing your bounce house and party rental business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
