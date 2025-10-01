import sancties from "@/data/sancties.json";
import Link from "next/link";

export default function Leerlingen() {
  const leerlingen = [
    {
      id: 1,
      name: "Peter",
      sancties: [sancties[0], sancties[2], sancties[3], sancties[1]],
    },
    { id: 2, name: "Gerard", sancties: [sancties[1], sancties[3]] },
  ];

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
            {leerlingen.map((leerling) => (
              <tr key={leerling.id}>
                <th scope="row">{leerling.id}</th>
                <td scope="col">{leerling.name}</td>
                <td scope="col" className="flex flex-row items-center gap-3">
                  {leerling.sancties.join(", ").slice(40, -1).length > 1 ? (
                    <>
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
                    </>
                  ) : (
                    <span>{leerling.sancties.join(", ").slice(0, 40)}</span>
                  )}
                </td>
                <td scope="col">
                  <button className="btn btn-primary">Koppelen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
