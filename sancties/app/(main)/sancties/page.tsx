"use client";
import FloatingButton from "@/components/FloatingButton";
import { useState } from "react";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasNiveau?: number;
}

export default function Sancties() {
  const [filter, setFilter] = useState<Filter>({});

  const [sancties, setSancties] = useState([
    {
      id: 1,
      naam: "Bord vegen",
      niveau: 1,
    },
    {
      id: 2,
      naam: "Nablijven",
      niveau: 2,
    },
    {
      id: 3,
      naam: "Koffie halen",
      niveau: 1,
    },
    {
      id: 4,
      naam: "Snoep kopen",
      niveau: 1,
    },
  ]);

  const UpdateFilters = ({
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

  const FilteredSancties = sancties.filter((sanctie) => {
    const { hasId, hasName, hasNiveau } = filter;

    if (hasId !== undefined && sanctie.id !== hasId) return false;
    if (hasName && !sanctie.naam.toLowerCase().includes(hasName)) return false;
    if (hasNiveau !== undefined && sanctie.niveau !== hasNiveau) return false;

    return true;
  });

  const RemoveSanctie = (
    e: React.MouseEvent,
    sanctie: { id: number; naam: string; niveau: number }
  ) => {
    e.preventDefault();

    setSancties((prev) =>
      prev.filter((prevSanctie) => prevSanctie.id !== sanctie.id)
    );
  };

  return (
    <>
      <section className="w-full">
        <div className="flex flex-row items-center mb-4 gap-2">
          <input
            className="form-control"
            type="number"
            placeholder="Sanctie ID"
            onChange={(e) =>
              UpdateFilters({
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
              UpdateFilters({
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
              UpdateFilters({
                type: "niveau",
                content: e.target.value.toLowerCase(),
              })
            }
          />
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Naam</th>
                <th scope="col">Niveau</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {FilteredSancties.length === 0 ? (
                <tr>
                  <td colSpan={4}>Geen resultaten gevonden</td>
                </tr>
              ) : (
                FilteredSancties.map((sanctie) => {
                  return (
                    <tr key={sanctie.id}>
                      <th scope="row">{sanctie.id}</th>
                      <td scope="col">{sanctie.naam}</td>
                      <td scope="col">{sanctie.niveau}</td>
                      <td scope="col">
                        <button
                          className="btn btn-secondary"
                          onClick={(e) => RemoveSanctie(e, sanctie)}
                        >
                          Sanctie wissen
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <FloatingButton target="/sancties/new" />
      </section>
    </>
  );
}
