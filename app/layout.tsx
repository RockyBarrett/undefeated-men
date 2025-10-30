import "./globals.css";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload audio for faster typewriter + button sounds */}
        <link rel="preload" href="/sounds/typewriter.mp3" as="audio" />
        <link rel="preload" href="/sounds/button-beep.mp3" as="audio" />
        <link rel="preload" href="/sounds/button-click.mp3" as="audio" />
      </head>
      <body>
        <header className="site-header">
          <Image
            src="/Undefeatedlogo.png"
            alt="Undefeated Men Logo"
            width={150}
            height={150}
            priority
          />
        </header>
        <main className="container typewriter-text">{children}</main>
      </body>
    </html>
  );
}