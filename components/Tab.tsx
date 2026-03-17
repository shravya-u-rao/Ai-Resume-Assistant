export default function Tabs({ activeTab, setActiveTab }: any) {
  const tabs = ["improve", "bullets", "skills"];

  return (
    <div className="flex gap-2 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1 rounded-lg text-sm ${
            activeTab === tab
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}