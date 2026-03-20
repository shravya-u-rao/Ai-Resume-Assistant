"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function OutputBox({
  output,
  onTyping,
}: {
  output: string;
  onTyping: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null); // 👈 important

  useEffect(() => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + output.charAt(i));
      onTyping();
      i++;
      if (i >= output.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [output]);

  // ✅ Copy formatted (rendered) content
  const handleCopy = async () => {
    try {
      const text = contentRef.current?.innerText || "";
      await navigator.clipboard.writeText(text);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="relative group">
      
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-xs bg-green-700 text-white px-2 py-1 rounded-md hover:bg-gray-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Markdown Content */}
      <div
        ref={contentRef} // 👈 important
        className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none"
      >
        <ReactMarkdown>{displayedText}</ReactMarkdown>
      </div>
    </div>
  );
}