import { prisma } from "@/lib/prisma";

export default async function Sancties() {
  // Haal alle sancties op met hun straffen informatie
  const sancties = await prisma.sanctie.findMany({
    include: {
      straffen: {
        include: {
          leerling: true
        }
      }
    }
  });

  return (
    <>
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4">Sancties Overzicht</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Naam</th>
              <th scope="col">Niveau</th>
              <th scope="col">Aantal Leerlingen</th>
              <th scope="col">Leerlingen</th>
            </tr>
          </thead>
          <tbody>
            {sancties.map((sanctie) => {
              const leerlingNamen = sanctie.straffen.map(straf => straf.leerling.naam);
              const leerlingText = leerlingNamen.join(", ");
              
              return (
                <tr key={sanctie.id}>
                  <th scope="row">{sanctie.id}</th>
                  <td scope="col">{sanctie.naam}</td>
                  <td scope="col">{sanctie.niveau}</td>
                  <td scope="col">{sanctie.straffen.length}</td>
                  <td scope="col">
                    {leerlingText.length > 40 ? (
                      <span title={leerlingText}>
                        {leerlingText.slice(0, 40)}...
                      </span>
                    ) : (
                      <span>{leerlingText}</span>
                    )}
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
