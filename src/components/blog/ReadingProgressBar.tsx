'use client'

import { RefObject, useEffect, useState } from "react";

export function ReadingProgressBar({
  contentRef
}: {
  contentRef: RefObject<HTMLDivElement> | null;
}) {
  const [percentage, setPercentage] = useState<number>(0);

  const handleScroll = () => {
    if (!contentRef?.current) return;
    const contentHeight = contentRef?.current.offsetHeight;
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;
    const progress = (scrolled / (contentHeight - windowHeight)) * 100;
    setPercentage(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-accent z-50"
      style={{ width: `${percentage}%` }}
    ></div>
  );
}
