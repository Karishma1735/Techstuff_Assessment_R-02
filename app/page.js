import PokemonTable from "./PokemonTable";

export const metadata = {
  title: "Pokémon Explorer",
};

export default function PokePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Pokémon Explorer
      </h1>
      <PokemonTable />
    </main>
  );
}
