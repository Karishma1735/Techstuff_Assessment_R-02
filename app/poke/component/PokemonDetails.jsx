"use client";

import { useState, useEffect } from "react";
import TypeTabs from "./TypeTabs";
import LoadingSpinner from "./LoadingSpinner";

export default function PokemonDetails({ pokemon }) {
  const [activeType, setActiveType] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeError, setTypeError] = useState(null);

  // Reset when pokemon changes
  useEffect(() => {
    if (pokemon?.types?.length > 0) {
      const firstType = pokemon.types[0].type.name;
      setActiveType(firstType);
    }
  }, [pokemon]);

  // Fetch type data when activeType changes
  useEffect(() => {
    if (!activeType) return;

    const fetchTypeData = async () => {
      setTypeLoading(true);
      setTypeError(null);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${activeType}`);
        if (!res.ok)
          throw new Error(`Failed to fetch type data (${res.status})`);
        const data = await res.json();
        setTypeData(data);
      } catch (err) {
        setTypeError(err.message || "Could not load type data.");
      } finally {
        setTypeLoading(false);
      }
    };

    fetchTypeData();
  }, [activeType]);

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 p-8">
        <span className="text-5xl">👆</span>
        <p className="text-sm text-center">
          Click a Pokémon name to see details
        </p>
      </div>
    );
  }

  const spriteUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        {spriteUrl && (
          <img
            src={spriteUrl}
            alt={pokemon.name}
            className="w-20 h-20 object-contain bg-gray-100 rounded-xl"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold capitalize text-gray-800">
            {pokemon.name}
          </h2>
          <p className="text-sm text-gray-500">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
        </div>
      </div>

      {/* Base stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
        <Stat label="Height" value={`${pokemon.base_experience ?? "—"} XP`} />
        <Stat label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
        <Stat label="Total Moves" value={pokemon.moves?.length ?? 0} />
        <Stat label="Game Indices" value={pokemon.game_indices?.length ?? 0} />
      </div>

      {/* Type tabs */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Types
        </p>
        <TypeTabs
          types={pokemon.types}
          activeType={activeType}
          onTypeChange={setActiveType}
        />
      </div>

      {/* Type-specific info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[100px]">
        {typeLoading && <LoadingSpinner size="sm" />}
        {typeError && <p className="text-red-500 text-sm">{typeError}</p>}
        {!typeLoading && !typeError && typeData && (
          <div>
            <p className="text-sm font-semibold capitalize text-gray-700 mb-3">
              {activeType} type info
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat
                label="Pokémon of this type"
                value={typeData.pokemon?.length ?? 0}
              />
              <Stat
                label="Moves of this type"
                value={typeData.moves?.length ?? 0}
              />
              <Stat
                label="Double damage from"
                value={
                  typeData.damage_relations?.double_damage_from?.length ?? 0
                }
              />
              <Stat
                label="Double damage to"
                value={typeData.damage_relations?.double_damage_to?.length ?? 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
