"use client";

import { useState, useEffect, useCallback } from "react";
import PokemonDetails from "./components/PokemonDetails";
import LoadingSpinner from "./components/LoadingSpinner";

const PAGE_LIMIT = 20;

export default function PokemonTable() {
  const [pokemonList, setPokemonList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

  const fetchList = useCallback(async (page) => {
    setListLoading(true);
    setListError(null);
    const offset = (page - 1) * PAGE_LIMIT;
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_LIMIT}&offset=${offset}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch list (${res.status})`);
      const data = await res.json();
      setPokemonList(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setListError(err.message || "Could not load Pokémon list.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(currentPage);
    setSelectedPokemon(null);
  }, [currentPage, fetchList]);

  const handleSelectPokemon = async (url, name) => {
    setDetailLoading(true);
    setDetailError(null);
    setSelectedPokemon(null);
    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch details for ${name} (${res.status})`);
      const data = await res.json();
      setSelectedPokemon(data);
    } catch (err) {
      setDetailError(err.message || `Could not load details for ${name}.`);
    } finally {
      setDetailLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * PAGE_LIMIT + 1;

  return (
    <div className="flex gap-6 items-start">
      {/* LEFT: Table + Pagination */}
      <div className="flex-shrink-0 w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tableheader */}
          <div className="grid grid-cols-[60px_1fr] bg-gray-100 border-b border-gray-200 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Sr.</span>
            <span>Pokémon Name</span>
          </div>

          {/* table body */}
          {listLoading ? (
            <LoadingSpinner />
          ) : listError ? (
            <div className="p-6 text-center">
              <p className="text-red-500 text-sm mb-3">{listError}</p>
              <button
                onClick={() => fetchList(currentPage)}
                className="text-sm text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <ul>
              {pokemonList.map((poke, idx) => {
                const srNo = startIndex + idx;
                const isSelected = selectedPokemon?.name === poke.name;
                return (
                  <li key={poke.name}>
                    <button
                      onClick={() => handleSelectPokemon(poke.url, poke.name)}
                      className={`w-full grid grid-cols-[60px_1fr] px-4 py-3 text-left text-sm transition-colors duration-100
                        border-b border-gray-100 last:border-0
                        ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <span className="text-gray-400">{srNo}</span>
                      <span className="capitalize">{poke.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {!listError && totalPages > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1 || listLoading}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600
                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages || listLoading}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600
                hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Detail panel */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
        {detailLoading ? (
          <LoadingSpinner size="lg" />
        ) : detailError ? (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-3">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-500 text-sm text-center">{detailError}</p>
            <button
              onClick={() => setDetailError(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        ) : (
          <PokemonDetails pokemon={selectedPokemon} />
        )}
      </div>
    </div>
  );
}
