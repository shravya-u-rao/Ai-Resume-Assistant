export default function TextInput({ input, setInput }: any) {
  return (
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Paste your resume or job description..."
      className="w-full p-3 rounded-lg bg-[#40414f] text-white border border-gray-600 outline-none resize-none"
      rows={4}
    />
  );
}