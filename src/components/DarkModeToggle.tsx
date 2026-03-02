"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const { setTheme, theme } = useTheme();
  console.log("setTheme", theme);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Monitor />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ngôn ngữ</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer bg-accent">
            Tiếng Việt <DropdownMenuShortcut>VN</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            English <DropdownMenuShortcut>US</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Chế độ màu sắc</DropdownMenuLabel>
          <DropdownMenuItem
            className={`cursor-pointer ${theme === "ligt" ? "bg-accent" : ""}`}
            onClick={() => setTheme("ligt")}
          >
            Sáng
            <DropdownMenuShortcut>
              <SunIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer ${theme === "dark" ? "bg-accent" : ""}`}
            onClick={() => setTheme("dark")}
          >
            Tối
            <DropdownMenuShortcut>
              <MoonIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer ${theme === "system" ? "bg-accent" : ""}`}
            onClick={() => setTheme("system")}
          >
            Hệ thống
            <DropdownMenuShortcut>
              <Monitor />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
