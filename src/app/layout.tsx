"use client";

import Navbar from "../components/navbar";
import { FilterProvider } from "./store/context";
import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FilterProvider>
          <Navbar />
          <div className="container">{children}</div>
        </FilterProvider>
      </body>
    </html>
  );
}
