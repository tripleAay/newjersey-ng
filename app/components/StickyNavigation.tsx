"use client";

import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Header from "./Header";

export default function StickyNavigation() {
  const [hideTopBar, setHideTopBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          hideTopBar ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
        }`}
      >
        <TopBar />
      </div>

      <Header />
    </div>
  );
}