"use client";
import { useSearchParams } from "next/navigation";

export default function Sancties() {
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries()).map((entry) =>
    decodeURIComponent(entry[0])
  );

  return (
    <>
      <section className="grid grid-cols-auto grid-cols-5 gap-2">
        {entries.map((sanctie) => (
          <div key={sanctie} className="h-20 bg-gray-100 border border-gray-200 rounded-[10px] flex items-center justify-center">
            <span className="wrap-break-word">{sanctie}</span>
          </div>
        ))}
      </section>
    </>
  );
}
