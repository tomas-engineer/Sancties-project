import sancties from "@/data/sancties.json";
import Link from "next/link";

export default function Leerlingen() {
  const leerlingen = [
    { id: 1, name: "Peter", sancties: [sancties[0], sancties[2], sancties[3], sancties[1]] },
    { id: 2, name: "Gerard", sancties: [sancties[1], sancties[3]] },
  ];

  return (
    <>
      <section className="w-full">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Naam</th>
              <th scope="col">Sancties</th>
              <th scope="col">Sanctie Maken</th>
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
                  <button className="btn btn-primary">Maken</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
