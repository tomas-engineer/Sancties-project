"use client";
import sancties from "@/data/sancties.json";
import Link from "next/link";
import { MouseEvent, useState } from "react";
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

  const toggleSanctieFilter = (e: MouseEvent) => {
    e.stopPropagation();
    const element = e.target as HTMLElement;
    const div = element.closest("div") as HTMLDivElement;
    const sanctie = div.textContent;

    setFilter((prev) => ({
      ...prev,
      hasSancties: prev.hasSancties
        ? prev.hasSancties.includes(sanctie)
          ? prev.hasSancties.filter((prevSanctie) => prevSanctie !== sanctie)
          : [...prev.hasSancties, sanctie]
        : [sanctie],
    }));
  };

  return (
    <>
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
                  onClick={(e) => toggleSanctieFilter(e)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filter.hasSancties?.includes(sanctie) || false}
                      readOnly
                    />
                    <span className="text-[17px]!">{sanctie}</span>
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
              updateFilters({ type: "id", content: Number(e.target.value) })
            }
          />

          <input
            className="form-control"
            type="naam"
            placeholder="Leerling naam"
            onChange={(e) =>
              updateFilters({
                type: "name",
                content: String(e.target.value.toLowerCase()),
              })
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
                  (filter.hasName &&
                    !leerling.name.toLowerCase().startsWith(filter.hasName))
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
              if (hasName && !leerling.name.toLowerCase().startsWith(hasName))
                return;
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
