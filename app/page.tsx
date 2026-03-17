"use client";

import { useState, useEffect, useRef } from "react";
// import Tabs from "@/components/Tab";
// import TextInput from "@/components/TextInput";
import OutputBox from "@/components/OutputBox";
import ModeSwitch from "@/components/ModeSwitch";
import { ArrowDown } from "lucide-react"; // You'll need to install lucide-react or use any icon

export default function Home() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [typingTrigger, setTypingTrigger] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("improve");
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto scroll to bottom when new messages arrive or typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typingTrigger]);

  // Check scroll position to show/hide scroll button
  const checkScrollPosition = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // Calculate if we're not at the bottom (with 100px threshold)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Check scroll position when messages change (content height changes)
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Optional: Hide button immediately after clicking
    setShowScrollButton(false);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    // Clear input
    setInput("");

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ input, type: activeTab }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Something went wrong" },
        ]);
        return;
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.result },
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="text-white text-center py-4 border-b border-gray-800 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-wide">
          ✨ AI Resume Assistant
        </h1>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-5 pb-52 relative"
        onScroll={checkScrollPosition} // Added onScroll handler as backup
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-xl whitespace-pre-wrap shadow-md ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-black"
                  : "bg-[#1f2937] text-gray-200 border border-gray-700"
              }`}
            >
              {msg.role === "ai" ? (
                <OutputBox 
                  output={msg.content} 
                  onTyping={() => setTypingTrigger(prev => prev + 1)}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 animate-pulse">
            🤖 Generating response...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-8 bg-green-500 hover:bg-green-600 text-black p-3 rounded-full shadow-lg transition-all duration-300 z-10 hover:scale-110"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={24} />
        </button>
      )}

      {/* Input */}
      <div className="fixed bottom-0 left-0 w-full p-4 border-t border-gray-800 bg-[#020617]/90 backdrop-blur-md">
        <ModeSwitch activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your resume or job description..."
            className="flex-1 p-3 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none resize-none focus:border-green-500"
            rows={2}
          />

          <button
            onClick={handleGenerate}
            className="px-5 bg-green-500 hover:bg-green-600 text-black rounded-xl font-medium transition"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}