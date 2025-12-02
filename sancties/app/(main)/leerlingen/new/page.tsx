"use client";
/* Alles van Tomas */

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function New() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const SubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>("input#usernameInput");

    const name = input?.value.trim();
    if (!name) {
      setError("Een of meerdere velden zijn niet ingevuld");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/leerlingen/add", {
      method: "POST",
      body: JSON.stringify({
        naam: name,
      }),
    });

    try {
      const data = await response.json();

      if (!response.ok) {
        if (data?.message) alert(data.message);

        throw new Error(
          "Something went wrong making the user: " +
            (data?.message || (await response.text()))
        );
      }

      if (!data.success) return alert(data.message);

      if (input) input.value = "";
      setLoading(false);

      router.push("/leerlingen");
    } catch (error: unknown) {
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
          disabled={loading}
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Bezig..." : "Aanmaken"}
        </button>
      </form>

      {typeof error === "string" && (
        <span
          className={
            error.includes("succesvol") ? "text-green-500" : "text-red-400"
          }
        >
          {error}
        </span>
      )}
    </div>
  );
}
