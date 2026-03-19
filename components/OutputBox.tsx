"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function OutputBox({ 
  output, 
  onTyping 
}: { 
  output: string; 
  onTyping: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + output.charAt(i));

      // 🔥 trigger scroll on every character
      onTyping();

      i++;
      if (i >= output.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [output]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
      <ReactMarkdown>
        {displayedText}
      </ReactMarkdown>
    </div>
  );
}