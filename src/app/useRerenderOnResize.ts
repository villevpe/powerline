import { useState, useEffect } from "react";

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, waitFor);
  };
};

export const useRerenderOnResize = () => {
  const [, rerender] = useState(0);

  useEffect(() => {
    const rerenderDebounced = debounce((event) => rerender(event), 16);
    window.addEventListener("resize", rerenderDebounced);

    return () => window.removeEventListener("resize", rerenderDebounced);
  }, []);
};
