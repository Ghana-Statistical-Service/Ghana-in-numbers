import { Bookmark, BarChart2 } from "lucide-react";
import { mostSearchedIndicators } from "@/data/dummy";

export default function MostSearchedCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-gray-800 font-semibold text-sm mb-4">Most Searched Indicators</p>
      <div className="space-y-3">
        {mostSearchedIndicators.map((item) => (
          <div key={item.rank} className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-medium w-4 flex-shrink-0">
              {item.rank}.
            </span>
            <span className="flex-1 text-gray-700 text-sm">{item.name}</span>
            {item.icon === "bookmark" ? (
              <Bookmark size={14} className="text-gray-400 flex-shrink-0" />
            ) : (
              <BarChart2 size={14} className="text-gray-400 flex-shrink-0" />
            )}
            <span className="text-gray-600 text-sm font-semibold w-12 text-right flex-shrink-0">
              {item.share}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
