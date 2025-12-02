"use client";
/* Alles van Tomas */

import FloatingButton from "@/components/FloatingButton";
import { useEffect, useState } from "react";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasNiveau?: number;
}

interface Sanctie {
  id: number;
  naam: string;
  niveau: number;
}

export default function Sancties() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>({});
  const [sancties, setSancties] = useState<Sanctie[]>([]);

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

  const RemoveSanctie = async (
    e: React.MouseEvent,
    sanctie: { id: number; naam: string; niveau: number }
  ) => {
    e.preventDefault();

    const response = await fetch("/api/sancties/delete", {
      method: "POST",
      body: JSON.stringify({ id: sanctie.id }),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        if (data?.message) alert(data.message);

        throw new Error(
          "Something went wrong deleting sanctie: " +
            (data?.message || (await response.text()))
        );
      }

      if (!data.success) return alert(data.message);

      setSancties((prev) =>
        prev.filter((prevSanctie) => prevSanctie.id !== sanctie.id)
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  const EditSanctie = async ({
    e,
    sanctie,
    type,
  }: {
    e: React.FocusEvent;
    sanctie: Sanctie;
    type: "Naam" | "Niveau";
  }) => {
    const element = e.target as HTMLInputElement;
    const newSanctie = element.value;

    const sendResponse = async (body: any) => {
      const response = await fetch("/api/sancties/edit", {
        method: "POST",
        body: JSON.stringify(body),
      });

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        return true;
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    };

    if (type === "Naam") {
      const oldSanctie = sanctie.naam;

      if (newSanctie && oldSanctie !== newSanctie) {
        await sendResponse({
          id: sanctie.id,
          naam: newSanctie,
        });
      }
    }

    if (type === "Niveau") {
      const oldSanctie = sanctie.niveau;

      if (newSanctie && oldSanctie !== Number(newSanctie)) {
        await sendResponse({
          id: sanctie.id,
          niveau: Number(newSanctie),
        });
      }
    }
  };

  useEffect(() => {
    const FetchSancties = async () => {
      const response = await fetch("/api/sancties");

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong fetching the sancties: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        return setSancties(
          data.sancties.map(
            ({
              ID,
              ...rest
            }: {
              ID: number;
              naam: string;
              niveau: number;
            }) => ({
              ...rest,
              id: ID,
            })
          )
        );
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    };

    (async () => {
      await FetchSancties();
      setLoading(false);
    })();
  }, []);

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
                  <td colSpan={4}>
                    {loading
                      ? "Sancties aan het laden"
                      : "Geen resultaten gevonden"}
                  </td>
                </tr>
              ) : (
                FilteredSancties.map((sanctie) => {
                  return (
                    <tr key={sanctie.id}>
                      <th scope="row">{sanctie.id}</th>
                      <td scope="col">
                        <input
                          type="text"
                          defaultValue={sanctie.naam}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          onBlur={(e) =>
                            EditSanctie({ e, sanctie, type: "Naam" })
                          }
                        />
                      </td>
                      <td scope="col">
                        <input
                          type="text"
                          defaultValue={sanctie.niveau}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          onBlur={(e) =>
                            EditSanctie({ e, sanctie, type: "Niveau" })
                          }
                        />
                      </td>
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
