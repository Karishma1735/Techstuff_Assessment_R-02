"use client";

const TYPE_COLORS = {
  fire: "bg-orange-100 text-orange-700 border-orange-300",
  water: "bg-blue-100 text-blue-700 border-blue-300",
  grass: "bg-green-100 text-green-700 border-green-300",
  electric: "bg-yellow-100 text-yellow-700 border-yellow-300",
  psychic: "bg-pink-100 text-pink-700 border-pink-300",
  ice: "bg-cyan-100 text-cyan-700 border-cyan-300",
  dragon: "bg-indigo-100 text-indigo-700 border-indigo-300",
  dark: "bg-gray-700 text-gray-100 border-gray-500",
  fairy: "bg-pink-200 text-pink-800 border-pink-400",
  normal: "bg-gray-100 text-gray-700 border-gray-300",
  fighting: "bg-red-100 text-red-700 border-red-300",
  flying: "bg-sky-100 text-sky-700 border-sky-300",
  poison: "bg-purple-100 text-purple-700 border-purple-300",
  ground: "bg-amber-100 text-amber-700 border-amber-300",
  rock: "bg-stone-100 text-stone-700 border-stone-300",
  bug: "bg-lime-100 text-lime-700 border-lime-300",
  ghost: "bg-violet-100 text-violet-700 border-violet-300",
  steel: "bg-slate-100 text-slate-700 border-slate-300",
};

export default function TypeTabs({ types, activeType, onTypeChange }) {
  if (!types || types.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {types.map((t) => {
        const typeName = t.type.name;
        const colorClass =
          TYPE_COLORS[typeName] || "bg-gray-100 text-gray-700 border-gray-300";
        const isActive = activeType === typeName;

        return (
          <button
            key={typeName}
            onClick={() => onTypeChange(typeName)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium capitalize transition-all duration-150
              ${colorClass}
              ${isActive ? "ring-2 ring-offset-1 ring-gray-400 shadow-sm scale-105" : "opacity-70 hover:opacity-100"}`}
          >
            {typeName}
          </button>
        );
      })}
    </div>
  );
}