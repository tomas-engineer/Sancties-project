"use client";
/* Alles van Tomas */

import FloatingButton from "@/components/FloatingButton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import StrengtheidIndicator from "@/components/StrengtheidIndicator";

interface Filter {
  hasId?: number;
  hasName?: string;
  hasSancties?: string[];
}

interface Sanctie {
  id: number;
  naam: string;
  niveau: number;
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

  const FilteredLeerlingen = leerlingen.filter((leerling) => {
    const { hasId, hasName, hasSancties } = filter;

    if (hasId !== undefined && leerling.id !== hasId) return false;
    if (hasName && !leerling.name.toLowerCase().includes(hasName)) return false;
    if (hasSancties && !hasSancties.every((s) => leerling.sancties.includes(s)))
      return false;

    return true;
  });

  const EditLeerling = async ({
    e,
    sanctieNaam,
    leerling,
    type,
  }: {
    e: React.FocusEvent | React.MouseEvent;
    sanctieNaam?: string;
    leerling: Leerling;
    type: "Naam" | "Sancties";
  }) => {
    if (!type) return;
    const sendRequest = async (body: unknown) => {
      const response = await fetch("/api/leerlingen/edit", {
        method: "POST",
        body: JSON.stringify(body),
      });

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong editing the user: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        return true;
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    };

    if (type === "Sancties" && sanctieNaam) {
      e.preventDefault();

      const parentElement = (e.target as HTMLElement).closest("div");
      const element = parentElement?.querySelector("span") as HTMLSpanElement;
      const selectedSanctie = element.textContent;

      const newSanctieNames = leerling.sancties.includes(selectedSanctie)
        ? leerling.sancties.filter((sanctie) => sanctie !== selectedSanctie)
        : [...leerling.sancties, selectedSanctie];

      const newSanctieIds = sancties
        .filter((sanctie) => newSanctieNames.includes(sanctie.naam))
        .map((sanctie) => sanctie.id);

      const result = await sendRequest({
        id: leerling.id,
        editType: "setSancties",
        sanctieIds: newSanctieIds,
      });

      if (result)
        setLeerlingen((prev) =>
          prev.map((prevLeerling) =>
            prevLeerling.id === leerling.id
              ? {
                  ...prevLeerling,
                  sancties: prevLeerling.sancties.includes(sanctieNaam)
                    ? prevLeerling.sancties.filter((s) => s !== sanctieNaam)
                    : [...prevLeerling.sancties, sanctieNaam],
                }
              : prevLeerling
          )
        );
    }

    if (type === "Naam") {
      const element = e.target as HTMLInputElement;

      const oldName = leerling.name;
      const newName = element.value;

      if (oldName !== newName && newName.length > 0)
        sendRequest({
          id: leerling.id,
          editType: "naam",
          naam: newName,
        });
    }
  };

  const RemoveLeerling = async (
    e: React.MouseEvent,
    leerling: { id: number; name: string; sancties: string[] }
  ) => {
    e.preventDefault();

    console.log(leerling);

    const response = await fetch("/api/leerlingen/delete", {
      method: "POST",
      body: JSON.stringify({
        id: leerling.id,
      }),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        if (data?.message) alert(data.message);

        throw new Error(
          "Something went wrong deleting the user: " +
            (data?.message || (await response.text()))
        );
      }

      if (!data.success) return alert(data.message);

      setLeerlingen((prev) =>
        prev.filter((prevLeerling) => prevLeerling.id !== leerling.id)
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  useEffect(() => {
    const FetchLeerlingen = async () => {
      const response = await fetch("/api/leerlingen");

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong fetching the users: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        if (data?.leerlingen) {
          const mappedLeerlingen: Leerling[] = data.leerlingen.map(
            (l: any) => ({
              id: l.ID,
              name: l.naam,
              sancties: l.sancties.map((s: any) => s.naam),
            })
          );

          setLeerlingen(mappedLeerlingen);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    };

    const FetchSancties = async () => {
      const response = await fetch("/api/sancties");

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong fetching sancties: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        if (data?.sancties) {
          const mappedSancties: Sanctie[] = data.sancties.map((s: any) => ({
            id: s.ID,
            naam: s.naam,
            niveau: s.niveau,
          }));

          setSancties(mappedSancties);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
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
              FilteredLeerlingen.map((leerling, i) => (
                <tr key={i}>
                  <th scope="row">{leerling.id}</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={leerling.name}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onBlur={(e) =>
                        EditLeerling({ e, leerling, type: "Naam" })
                      }
                    />
                  </td>
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
                              EditLeerling({
                                e,
                                leerling,
                                type: "Sancties",
                                sanctieNaam: sanctie.naam,
                              })
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
      <StrengtheidIndicator />
      <FloatingButton target="/leerlingen/new" />
    </section>
  );
}
