// components/MarkdownRenderer.tsx
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

// Use memo to prevent unnecessary re-renders
const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-semibold mt-5 mb-3 text-white" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-medium mt-4 mb-2 text-white" {...props} />
        ),
        
        // Paragraphs
        p: ({ node, ...props }) => (
          <p className="mb-4 text-gray-200 leading-relaxed" {...props} />
        ),
        
        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-200" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-200" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-gray-200" {...props} />
        ),
        
        // Code blocks
        code: ({ node, inline, className, children, ...props }: any) => {
          return !inline ? (
            <pre className="bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
              <code className="text-green-400 text-sm font-mono" {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-800 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        
        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-green-500 pl-4 italic my-4 text-gray-300" {...props} />
        ),
        
        // Links
        a: ({ node, ...props }) => (
          <a 
            className="text-green-400 hover:text-green-300 underline transition-colors" 
            target="_blank" 
            rel="noopener noreferrer" 
            {...props} 
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

export default MarkdownRenderer;