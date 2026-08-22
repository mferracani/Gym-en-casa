import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrena Casa",
  description: "Tu entrenamiento de fuerza en casa, claro y seguro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
