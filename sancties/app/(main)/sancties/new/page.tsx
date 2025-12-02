"use client";
/* Alles van Tomas */

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function New() {
  const [error, setError] = useState<string | boolean>(false);
  const router = useRouter();

  const SubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);

    const form = (e.target as HTMLElement).closest("form");

    const usernameInput = form?.querySelector(
      "#usernameInput"
    ) as HTMLInputElement;
    const niveauInput = form?.querySelector("#niveauInput") as HTMLInputElement;

    const name = usernameInput.value;
    const niveau = niveauInput.value;

    if (!name || !niveau)
      return setError("Een of meerdere velden zijn niet ingevuld");

    const response = await fetch("/api/sancties/add", {
      method: "POST",
      body: JSON.stringify({
        naam: name,
        niveau: Number(niveau),
      }),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        if (data?.message) alert(data.message);

        throw new Error(
          "Something went wrong making the sanctie: " +
            (data?.message || (await response.text()))
        );
      }

      if (!data.success) return alert(data.message);

      if (niveauInput) niveauInput.value = "";
      router.push("/sancties");
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <form
        className="flex flex-row items-center justify-center gap-2 mb-3"
        onSubmit={SubmitForm}
      >
        <input
          type="text"
          className="form-control w-fit"
          id="usernameInput"
          placeholder="Naam"
        />

        <input
          type="text"
          className="form-control w-fit"
          id="niveauInput"
          placeholder="Niveau"
        />

        <button type="submit" className="btn btn-primary">
          Aanmaken
        </button>
      </form>

      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}
