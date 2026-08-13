"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/actions/auth";
import toast from "react-hot-toast";

interface IdleTimeoutProviderProps {
  children: React.ReactNode;
  timeoutInMinutes: number;
}

export default function IdleTimeoutProvider({ 
  children, 
  timeoutInMinutes 
}: IdleTimeoutProviderProps) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logoutAndRedirect = useCallback(async () => {
    // Attempt to logout using the server action
    try {
      await logoutUser();
      toast("You have been logged out due to inactivity", { icon: "🕒" });
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error", error);
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Convert minutes to milliseconds
    const timeoutMs = timeoutInMinutes * 60 * 1000;
    
    timerRef.current = setTimeout(() => {
      logoutAndRedirect();
    }, timeoutMs);
  }, [timeoutInMinutes, logoutAndRedirect]);

  useEffect(() => {
    // Initial setup
    resetTimer();

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    
    // Attach event listeners to document
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      // Cleanup
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  return <>{children}</>;
}
