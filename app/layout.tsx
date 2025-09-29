import "./globals.css";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Image
            src="/Undefeatedlogo.png"
            alt="Undefeatedlogo.png"
            width={150}
            height={150}
            priority
          />
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}