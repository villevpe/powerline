"use client";

import { useState, useEffect } from "react";

const useViewportWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width;
};

export const useLayoutMode: () => "mobile" | "desktop" = () => {
  const width = useViewportWidth();
  return width < 768 ? "mobile" : "desktop";
};
