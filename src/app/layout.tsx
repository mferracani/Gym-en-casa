import type { Metadata } from "next";

import { TrainingProvider } from "@/state/training/training-provider";

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
    <html data-scroll-behavior="smooth" lang="es-AR">
      <body>
        <TrainingProvider>{children}</TrainingProvider>
      </body>
    </html>
  );
}
