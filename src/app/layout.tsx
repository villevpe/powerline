import { ReactNode } from "react";
import Head from "next/head";
import "./globals.css";

export const metadata = {
  title: "PowerLine",
  description: "Prices of electricity in Finland by the hour",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#000000" />
          <meta name="viewport" content="width=device-width, minimal-ui" />
        </head>
        <body>{children}</body>
      </html>
    </>
  );
}
