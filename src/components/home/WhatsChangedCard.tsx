import { TrendingDown } from "lucide-react";
import { whatsChanged } from "@/data/dummy";

export default function WhatsChangedCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-gray-800 font-semibold text-sm mb-4">What&apos;s changed this month?</p>
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "#DCFCE7" }}
        >
          <TrendingDown size={16} style={{ color: "#16A34A" }} />
        </div>
        <div>
          <p className="text-gray-700 text-sm leading-relaxed">
            <span className="font-semibold">{whatsChanged.indicator}</span>{" "}
            decreased from{" "}
            <span className="font-semibold text-red-500">{whatsChanged.from}</span>
            {" "}to{" "}
            <span className="font-semibold text-green-600">{whatsChanged.to}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
