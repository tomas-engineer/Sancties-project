import Link from "next/link";

export default function Index() {
  return (
    <>
      <section className="w-full h-full flex flex-col items-center justify-center">
        <h1>Welkom Terug</h1>
        <p>Kies een actie om verder te gaan:</p>

        <div className="flex flex-row items-stretch gap-5 mt-5">
          <div className="flex flex-col">
            <h4>Beheren</h4>
            <Link href={"/sancties"}>Sancties</Link>
            <Link href={"/leerlingen"}>Leerlingen</Link>
          </div>

          <div className="flex flex-col">
            <h4>Aanmaken</h4>
            <Link href={"/sancties/new"}>Nieuwe sanctie</Link>
            <Link href={"/leerlingen/new"}>Nieuwe leerling</Link>
          </div>
        </div>

        <div className="mt-15"></div>
        <p>
          Of <Link href="/rad">draai aan het rad</Link>
        </p>
      </section>
    </>
  );
}
