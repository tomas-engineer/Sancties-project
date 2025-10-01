import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SearchParams {
  leerlingId?: string;
}

export default async function LeeringSancties({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const leerlingId = searchParams.leerlingId;
  
  if (!leerlingId) {
    notFound();
  }

  // Haal de leerling op met al zijn sancties
  const leerling = await prisma.leerling.findUnique({
    where: { id: parseInt(leerlingId) },
    include: {
      straffen: {
        include: {
          sanctie: true
        }
      }
    }
  });

  if (!leerling) {
    notFound();
  }

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Sancties van {leerling.naam}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {leerling.straffen.map((straf) => (
            <div key={straf.id} className="h-20 bg-gray-100 border border-gray-200 rounded-[10px] flex items-center justify-center p-2">
              <div className="text-center">
                <div className="font-semibold">{straf.sanctie.naam}</div>
                <div className="text-sm text-gray-600">Niveau: {straf.sanctie.niveau}</div>
              </div>
            </div>
          ))}
        </div>
        {leerling.straffen.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Deze leerling heeft nog geen sancties.
          </p>
        )}
      </section>
    </>
  );
}
