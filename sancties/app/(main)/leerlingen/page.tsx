"use client";
import FloatingButton from "@/components/FloatingButton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasSancties?: string[];
}

interface Sanctie {
  id: number;
  naam: string;
  niveau: string;
}

interface Leerling {
  id: number;
  name: string;
  sancties: string[];
}

export default function Leerlingen() {
  const [loading, setLoading] = useState(true);
  const [sancties, setSancties] = useState<Sanctie[]>([]);

  const [leerlingen, setLeerlingen] = useState<Leerling[]>([]);

  const [filter, setFilter] = useState<Filter>({});

  const UpdateFilters = ({
    type,
    content,
  }: {
    type: "id" | "name";
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
        setFilter((prev) => ({ ...prev, hasName: content as string }));
        break;
    }
  };

  const ToggleSanctieFilter = (e: React.MouseEvent, naam: string) => {
    e.stopPropagation();

    setFilter((prev) => ({
      ...prev,
      hasSancties: prev.hasSancties
        ? prev.hasSancties.includes(naam)
          ? prev.hasSancties.filter((s) => s !== naam)
          : [...prev.hasSancties, naam]
        : [naam],
    }));
  };

  const SanctieToevoegen = (
    e: React.MouseEvent,
    naam: string,
    leerling: { id: number; name: string; sancties: string[] }
  ) => {
    e.stopPropagation();

    setLeerlingen((prev) =>
      prev.map((prevLeerling) =>
        prevLeerling.id === leerling.id
          ? {
              ...prevLeerling,
              sancties: prevLeerling.sancties.includes(naam)
                ? prevLeerling.sancties.filter((s) => s !== naam)
                : [...prevLeerling.sancties, naam],
            }
          : prevLeerling
      )
    );
  };

  const FilteredLeerlingen = leerlingen.filter((leerling) => {
    const { hasId, hasName, hasSancties } = filter;

    if (hasId !== undefined && leerling.id !== hasId) return false;
    if (hasName && !leerling.name.toLowerCase().includes(hasName)) return false;
    if (hasSancties && !hasSancties.every((s) => leerling.sancties.includes(s)))
      return false;

    return true;
  });

  const RemoveLeerling = (
    e: React.MouseEvent,
    leerling: { id: number; name: string; sancties: string[] }
  ) => {
    e.preventDefault();

    setLeerlingen((prev) =>
      prev.filter((prevLeerling) => prevLeerling.id !== leerling.id)
    );
  };

  useEffect(() => {
    const FetchLeerlingen = async () => {
      const response = await fetch("/api/leerlingen");
      if (!response.ok) return console.log(await response.text());

      const data = await response.json();
      if (data?.leerlingen) setLeerlingen(data.leerlingen);
      return;
    };

    const FetchSancties = async () => {
      const response = await fetch("/api/sancties");
      if (!response.ok) return console.log(await response.text());

      const data = await response.json();
      console.log(data);

      if (data?.sancties) setSancties(data.sancties);
      return;
    };

    (async () => {
      await FetchLeerlingen();
      await FetchSancties();
      setLoading(false);
    })();
  }, []);

  return (
    <section className="w-full">
      <div className="flex flex-row items-center mb-4 gap-2">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Sancties
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {sancties.map((sanctie, index) => (
              <Dropdown.Item
                key={index}
                onClick={(e) => ToggleSanctieFilter(e, sanctie.naam)}
              >
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      filter.hasSancties?.includes(sanctie.naam) || false
                    }
                    readOnly
                  />
                  <span className="text-[17px]!">{sanctie.naam}</span>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <input
          className="form-control"
          type="number"
          placeholder="Leerling ID"
          onChange={(e) =>
            UpdateFilters({ type: "id", content: e.target.value.toLowerCase() })
          }
        />

        <input
          className="form-control"
          type="text"
          placeholder="Leerling naam"
          onChange={(e) =>
            UpdateFilters({
              type: "name",
              content: e.target.value.toLowerCase(),
            })
          }
        />
      </div>

      <div>
        <table className="table table-striped">
          <thead className="sticky top-0">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Naam</th>
              <th scope="col">Sancties</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {FilteredLeerlingen.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  {loading
                    ? "Leerlingen aan het laden"
                    : "Geen resultaten gevonden"}
                </td>
              </tr>
            ) : (
              FilteredLeerlingen.map((leerling) => (
                <tr key={leerling.id}>
                  <th scope="row">{leerling.id}</th>
                  <td>{leerling.name}</td>
                  <td>
                    {leerling.sancties.length > 0 ? (
                      <div className="flex flex-row items-center gap-3">
                        <span className="text-[16px]!">
                          {leerling.sancties.join(", ").slice(0, 40)}
                          {leerling.sancties.join(", ").length > 40
                            ? "..."
                            : ""}
                        </span>
                        <Link
                          className="btn btn-secondary"
                          href={`/leerlingen/sancties?${leerling.sancties
                            .map((s) => encodeURIComponent(s))
                            .join("&")}`}
                        >
                          Alles bekijken
                        </Link>
                      </div>
                    ) : (
                      <span>Geen sancties</span>
                    )}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Sanctie koppelen
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {sancties.map((sanctie, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={(e) =>
                              SanctieToevoegen(e, sanctie.naam, leerling)
                            }
                          >
                            <div className="flex flex-row items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  leerling.sancties?.includes(sanctie.naam) ||
                                  false
                                }
                                readOnly
                              />
                              <span className="text-[17px]!">
                                {sanctie.naam}
                              </span>
                            </div>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td scope="col">
                    <button
                      className="btn btn-secondary"
                      onClick={(e) => RemoveLeerling(e, leerling)}
                    >
                      Leerling wissen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FloatingButton target="/leerlingen/new" />
    </section>
  );
}
