import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Leerlingen() {
  // Haal alle leerlingen op met hun straffen en sancties
  const leerlingen = await prisma.leerling.findMany({
    include: {
      straffen: {
        include: {
          sanctie: true
        }
      }
    }
  });

  return (
    <>
      <section className="w-full">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Naam</th>
              <th scope="col">Sancties</th>
              <th scope="col">Sanctie Koppelen</th>
            </tr>
          </thead>

          <tbody>
            {leerlingen.map((leerling) => {
              const sanctieNamen = leerling.straffen.map(straf => straf.sanctie.naam);
              const sanctieText = sanctieNamen.join(", ");
              
              return (
                <tr key={leerling.id}>
                  <th scope="row">{leerling.id}</th>
                  <td scope="col">{leerling.naam}</td>
                  <td scope="col" className="flex flex-row items-center gap-3">
                    {sanctieText.length > 40 ? (
                      <>
                        <span>
                          {sanctieText.slice(0, 40)}...
                        </span>{" "}
                        <Link
                          className="btn btn-primary"
                          href={`/leerlingen/sancties?leerlingId=${leerling.id}`}
                        >
                          Alles Bekijken
                        </Link>
                      </>
                    ) : (
                      <span>{sanctieText}</span>
                    )}
                  </td>
                  <td scope="col">
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
