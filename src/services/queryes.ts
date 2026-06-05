"use client";
import { useQuery } from "@tanstack/react-query";
import { currentUser } from "./user.service";

export const useCurrentUser = () => {
  const token =
    typeof window !== "undefined" && localStorage.getItem("vendoeAccessToken");
  return useQuery({
    queryKey: ["current_user"],
    queryFn: currentUser,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!token,
    retry: false, // optional
  });
};
