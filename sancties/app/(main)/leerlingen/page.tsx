"use client";
import sancties from "@/data/sancties.json";
import Link from "next/link";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasSancties?: string[];
}

export default function Leerlingen() {
  const [filter, setFilter] = useState<Filter>({
    hasId: undefined,
    hasName: undefined,
    hasSancties: undefined,
  });

  const leerlingen = [
    {
      id: 1,
      name: "Peter",
      sancties: [sancties[0], sancties[2], sancties[3], sancties[1]],
    },
    { id: 2, name: "Gerard", sancties: undefined },
  ];

  const updateFilters = ({
    type,
    content,
  }: {
    type: "id" | "name";
    content: number | string;
  }) => {
    switch (type) {
      case "id":
        setFilter((prev) => ({ ...prev, hasId: content as number }));
        break;
      case "name":
        setFilter((prev) => ({ ...prev, hasName: content as string }));
        break;
    }
  };

  return (
    <>
      <section className="w-full">
        <div className="flex flex-row items-center mb-4 gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Dropdown button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <input
            className="form-control"
            type="number"
            placeholder="Leerling ID"
            onChange={(e) =>
              updateFilters({ type: "id", content: Number(e.target.value) })
            }
          />

          <input
            className="form-control"
            type="naam"
            placeholder="Leerling naam"
            onChange={(e) =>
              updateFilters({ type: "name", content: String(e.target.value.toLowerCase()) })
            }
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="align-middle" scope="col">
                ID
              </th>
              <th className="align-middle" scope="col">
                Naam
              </th>
              <th className="align-middle" scope="col">
                Sancties
              </th>
              <th className="align-middle" scope="col">
                Sanctie Koppelen
              </th>
            </tr>
          </thead>

          <tbody>
            {filter &&
              leerlingen.every(
                (leerling) =>
                  (filter.hasSancties &&
                    !filter.hasSancties?.every(
                      (sanctie) =>
                        leerling.sancties && leerling.sancties.includes(sanctie)
                    )) ||
                  (filter.hasId && filter.hasId !== leerling.id) ||
                  (filter.hasName && filter.hasName !== leerling.name.toLowerCase())
              ) && (
                <tr>
                  <td>No results found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}

            {leerlingen.map((leerling) => {
              const { hasId, hasName, hasSancties } = filter;

              if (hasId && leerling.id !== hasId) return;
              if (hasName && leerling.name.toLowerCase() !== hasName) return;
              if (
                hasSancties &&
                !hasSancties.every(
                  (sanctie) =>
                    leerling.sancties && leerling.sancties.includes(sanctie)
                )
              )
                return;

              return (
                <tr key={leerling.id}>
                  <th className="align-middle" scope="row">
                    {leerling.id}
                  </th>
                  <td className="align-middle" scope="col">
                    {leerling.name}
                  </td>
                  <td scope="col" className="align-middle">
                    {leerling.sancties &&
                    leerling.sancties.join(", ").slice(40, -1).length > 1 ? (
                      <div className="flex flex-row items-center gap-3">
                        <span>
                          {leerling.sancties.join(", ").slice(0, 40)}...
                        </span>{" "}
                        <Link
                          className="btn btn-primary"
                          href={`/leerlingen/sancties?${leerling.sancties
                            .map((sanctie) => encodeURIComponent(sanctie))
                            .join("&")}`}
                        >
                          Alles Bekijken
                        </Link>
                      </div>
                    ) : (
                      <span>
                        {leerling.sancties
                          ? leerling.sancties.join(", ").slice(0, 40)
                          : "Geen sancties gevonden"}
                      </span>
                    )}
                  </td>
                  <td className="align-middle" scope="col">
                    <button className="btn btn-primary">Koppelen</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
