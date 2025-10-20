"use client";
import FloatingButton from "@/components/FloatingButton";
import sancties from "@/data/sancties.json";
import Link from "next/link";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasSancties?: string[];
}

export default function Leerlingen() {
  const [leerlingen, setLeerlingen] = useState([
    {
      id: 1,
      name: "Peter",
      sancties: [
        sancties[0].naam,
        sancties[2].naam,
        sancties[3].naam,
        sancties[1].naam,
      ],
    },
    { id: 2, name: "Gerard", sancties: [sancties[1].naam, sancties[3].naam] },
  ]);

  const [filter, setFilter] = useState<Filter>({});

  const updateFilters = ({
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

  const toggleSanctieFilter = (e: React.MouseEvent, naam: string) => {
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

  const sanctieToevoegen = (
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

  const filteredLeerlingen = leerlingen.filter((leerling) => {
    const { hasId, hasName, hasSancties } = filter;

    if (hasId !== undefined && leerling.id !== hasId) return false;
    if (hasName && !leerling.name.toLowerCase().includes(hasName)) return false;
    if (hasSancties && !hasSancties.every((s) => leerling.sancties.includes(s)))
      return false;

    return true;
  });

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
                onClick={(e) => toggleSanctieFilter(e, sanctie.naam)}
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
            updateFilters({ type: "id", content: e.target.value.toLowerCase() })
          }
        />

        <input
          className="form-control"
          type="text"
          placeholder="Leerling naam"
          onChange={(e) =>
            updateFilters({
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
            </tr>
          </thead>

          <tbody>
            {filteredLeerlingen.length === 0 ? (
              <tr>
                <td colSpan={4}>Geen resultaten gevonden</td>
              </tr>
            ) : (
              filteredLeerlingen.map((leerling) => (
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
                              sanctieToevoegen(e, sanctie.naam, leerling)
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
