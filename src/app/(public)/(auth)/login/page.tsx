"use client";
import LoginForm from "@/components/public/LoginForm";
import React from "react";
export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center">
      {/* Restaurant icons decoration */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">
        🍜
      </div>
      <div
        className="absolute top-20 right-20 text-5xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        🍕
      </div>
      <div
        className="absolute bottom-20 left-20 text-6xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      >
        🍱
      </div>
      <div
        className="absolute bottom-10 right-10 text-5xl opacity-20 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        ☕
      </div>
      <div
        className="absolute top-1/2 left-5 text-4xl opacity-20 animate-pulse"
        style={{ animationDelay: "1.5s" }}
      >
        🍲
      </div>
      <div
        className="absolute top-1/3 right-5 text-4xl opacity-20 animate-pulse"
        style={{ animationDelay: "2.5s" }}
      >
        🥗
      </div>
      <div className="border rounded-md shadow-sm w-100">
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold mb-2">Đăng nhập</h1>
            <p className="text-muted-foreground">
              Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
