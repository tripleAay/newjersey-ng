"use client";
import { useEffect, useState } from "react";

export function useTypeText(fullText: string, speed = 35) {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    setText("");

    const t = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(t);
    }, speed);

    return () => clearInterval(t);
  }, [fullText, speed]);

  return text;
}
