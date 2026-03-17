export default function ModeSwitch({ activeTab, setActiveTab }: any) {
  const options = [
    { id: "improve", label: "Improve" },
    { id: "bullets", label: "Bullet Points" },
    { id: "skills", label: "Skills" },
  ];

  return (
    <div className="flex bg-[#1f2937] p-1 rounded-xl mb-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setActiveTab(opt.id)}
          className={`flex-1 py-2 rounded-lg text-sm transition ${
            activeTab === opt.id
              ? "bg-green-500 text-black font-medium"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}