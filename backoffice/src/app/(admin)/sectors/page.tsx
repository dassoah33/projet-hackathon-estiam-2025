"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Filiere = {
  id: number;
  nom: string;
};

export default function FilieresPage() {
  const [search, setSearch] = useState("");
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://apimycampus.odyzia.com/api/filieres")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFilieres(data.filieres);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredFilieres = filieres.filter((filiere) =>
    filiere.nom.toLowerCase().includes(search.toLowerCase())
  );

  // Gestion sélection
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredFilieres.length) {
      setSelected([]);
    } else {
      setSelected(filteredFilieres.map((f) => f.id));
    }
  };

  return (
    <div className="p-6 space-y-9">
      {/* Titre et sous-titre */}
      <div>
        <h1 className="text-3xl font-bold text-[#2563eb]">Filières</h1>
        <p className="text-gray-500 text-base mt-1">
          Voici une liste de toutes les filières disponibles.
        </p>
      </div>
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div className="space-x-3">
          <Button variant="default">Créer une filière</Button>
          <Button variant="destructive" disabled={selected.length === 0}>
            Supprimer
          </Button>
        </div>
        <Input
          placeholder="Rechercher une filière..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filières Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    filteredFilieres.length > 0 &&
                    selected.length === filteredFilieres.length
                  }
                  onChange={toggleSelectAll}
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filteredFilieres.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-400">
                  Aucune filière trouvée.
                </td>
              </tr>
            ) : (
              filteredFilieres.map((filiere) => (
                <tr
                  key={filiere.id}
                  className={selected.includes(filiere.id) ? "bg-blue-50" : ""}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(filiere.id)}
                      onChange={() => toggleSelect(filiere.id)}
                      aria-label={`Sélectionner ${filiere.nom}`}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{filiere.nom}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
