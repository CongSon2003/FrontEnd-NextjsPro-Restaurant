"use client";
import {
  useQuery, //
  useMutation,
  useQueryClient, // "Chìa Khóa Truy Cập" (The Hook, Custom Hook)
  /*
    useQueryClient: là một Custom Hook. 
    useQueryClient: Bạn dùng nó bên trong các Component con để truy cập vào cái "kho" QueryClient mà bạn đã tạo ở trên.
    useQueryClient: Thực hiện các hành động "thao túng" cache như làm mới dữ liệu, xóa cache hoặc cập nhật dữ liệu thủ công.
  */
  QueryClient, // là một class đóng vai trò là trung tâm điều khiển, Khởi tạo môi trường cho TanStack Query hoạt động.
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function TanstackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
