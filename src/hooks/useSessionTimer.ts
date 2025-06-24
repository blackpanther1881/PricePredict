import { useEffect, useState } from "react";
import { SESSION_TIME } from "@utils/constants";

export const useSessionTimer = (
  onExpire: () => void,
  isAuthenticated: boolean
) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {

    const sessionStartStr = sessionStorage.getItem("sessionStart");

    if (!sessionStartStr) return;

    const sessionStart = parseInt(sessionStartStr, 10);
    const sessionDuration = SESSION_TIME * 60 * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStart;
      const remaining = sessionDuration - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("sessionStart");
        onExpire();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const minutes = timeLeft ? Math.floor(timeLeft / 60000) : SESSION_TIME;
  const seconds = timeLeft ? Math.floor((timeLeft % 60000) / 1000) : 0;

  return { minutes, seconds };
};
