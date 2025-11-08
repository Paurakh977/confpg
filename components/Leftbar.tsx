"use client";
import Link from "next/link";
import { useState } from "react";
import { departmentColors } from "@/lib/departmentColors";
import { ChevronRight } from "lucide-react"; // dropdown icon

// school → programs mapping
const schoolPrograms: Record<string, string[]> = {
  Arts: ["CD", "FA", "CDV", "ECO", "MS", "ENGMCJ", "EM", "YS"],
  Education: ["TESOL", "TCSOL", "MATHED", "CIVTED", "ITED"],
  Engineering: [
    "ARCH",
    "HC",
    "AI",
    "CHE",
    "CE",
    "MINE",
    "CSE",
    "BIT",
    "CS",
    "CYBER",
    "EEE",
    "GEOM",
    "ME",
  ],
  Law: ["LAW"],
  Management: ["BBIS", "BBA"],
  Science: ["BT", "DS", "CM", "PHARM", "AP"],
};

export default function LeftBar() {
  const [openSchool, setOpenSchool] = useState<string | null>(null);
  const toggleSchool = (school: string) =>
    setOpenSchool(openSchool === school ? null : school);

  return (
    <aside className="w-72 min-h-screen bg-black border-r border-white/10 p-5 text-white overflow-y-auto font-light tracking-wide z-10">
      {/* ASCII Logo */}
      <div className="mb-7 text-center">
        <Link href="/" className="inline-block group select-none">
          <pre className="text-[10px] font-mono leading-tight whitespace-pre group-hover:text-blue-400 transition-colors animate-neon">
{String.raw`
 _  __ _    _ 
| |/ /| |  | |
| ' / | |  | |
|  <  | |  | |
| . \ | |__| |
|_|\_\ \____/ 
`}
          </pre>
        </Link>
      </div>

      {/* Schools + Programs */}
      <nav className="space-y-3">
        {Object.entries(schoolPrograms).map(([school, programs]) => (
          <div key={school} className="overflow-hidden">
            {/* School Button */}
            <button
              onClick={() => toggleSchool(school)}
              className="w-full flex justify-between items-center py-2 px-3 text-left text-gray-300 hover:text-blue-400 font-medium transition-all duration-200"
            >
              <span>{school}</span>
              <ChevronRight
                size={18}
                className={`transition-transform duration-300 ${
                  openSchool === school ? "rotate-90 text-blue-400" : "rotate-0"
                }`}
              />
            </button>

            {/* Programs Dropdown */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                openSchool === school
                  ? "max-h-96 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-2 grid grid-cols-2 gap-2">
                {programs.map((prog) => (
                  <li key={prog}>
                    <Link
                      href={`/?program=${prog}`}
                      className={`block text-center px-3 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                        departmentColors[prog]
                          ? `${departmentColors[prog]} border border-white/20`
                          : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}
                      title={prog}
                    >
                      {prog}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-600 border-t border-gray-800 pt-3 text-center">
        © 2025 Kathmandu University
      </div>
    </aside>
  );
}
  