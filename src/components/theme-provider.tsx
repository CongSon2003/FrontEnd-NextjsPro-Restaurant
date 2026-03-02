"use client";
// theme-provider.tsx Dùng để bao bọc ThemeProvider từ next-themes
// Dùng Darkmode and LightMode
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
