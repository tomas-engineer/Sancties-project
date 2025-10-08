"use client";
import sancties from "@/data/sancties.json";
import { useState } from "react";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasNiveau?: number;
}

export default function Sancties() {
  const [filter, setFilter] = useState<Filter>({});

  const updateFilters = ({
    type,
    content,
  }: {
    type: "id" | "name" | "niveau";
    content: number | string;
  }) => {
    switch (type) {
      case "id":
        setFilter((prev) => ({
          ...prev,
          hasId: content === "" ? undefined : Number(content),
        }));
        break;
      case "name":
        setFilter((prev) => ({ ...prev, hasName: String(content) }));
        break;
      case "niveau":
        setFilter((prev) => ({
          ...prev,
          hasNiveau: content === "" ? undefined : Number(content),
        }));
        break;
    }
  };

  const filteredSancties = sancties.filter((sanctie) => {
    const { hasId, hasName, hasNiveau } = filter;

    if (hasId !== undefined && sanctie.id !== hasId) return false;
    if (hasName && !sanctie.naam.toLowerCase().includes(hasName)) return false;
    if (hasNiveau !== undefined && sanctie.niveau !== hasNiveau) return false;

    return true;
  });

  return (
    <>
      <section className="w-full">
        <div className="flex flex-row items-center mb-4 gap-2">
          <input
            className="form-control"
            type="number"
            placeholder="Sanctie ID"
            onChange={(e) =>
              updateFilters({
                type: "id",
                content: e.target.value.toLowerCase(),
              })
            }
          />

          <input
            className="form-control"
            type="text"
            placeholder="Sanctie naam"
            onChange={(e) =>
              updateFilters({
                type: "name",
                content: e.target.value.toLowerCase(),
              })
            }
          />

          <input
            className="form-control"
            type="number"
            placeholder="Sanctie niveau"
            onChange={(e) =>
              updateFilters({
                type: "niveau",
                content: e.target.value.toLowerCase(),
              })
            }
          />
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Naam</th>
                <th scope="col">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {filteredSancties.length === 0 ? (
                <tr>
                  <td colSpan={4}>Geen resultaten gevonden</td>
                </tr>
              ) : (
                filteredSancties.map((sanctie) => {
                  return (
                    <tr key={sanctie.id}>
                      <th scope="row">{sanctie.id}</th>
                      <td scope="col">{sanctie.naam}</td>
                      <td scope="col">{sanctie.niveau}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
