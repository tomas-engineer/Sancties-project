"use client";

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

    try {
      console.log('Sending request to:', '/api/leerlingen/maken');
      console.log('With data:', { naam: name });

      const response = await fetch("/api/leerlingen/maken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          naam: name,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        // We krijgen HTML in plaats van JSON
        const htmlText = await response.text();
        console.error('Received HTML instead of JSON:', htmlText.substring(0, 200));
        setError('API route not found or returning HTML');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Leerling aangemaakt:", data);
        // Reset form
        if (input) input.value = '';
        // Optioneel: ga terug naar leerlingen page
        // router.push('/leerlingen');
        setError("Leerling succesvol aangemaakt!");
      } else {
        console.error("Fout bij het aanmaken van leerling:", data.error);
        setError(data.error || "Er is een fout opgetreden");
      }
    } catch (err) {
      console.error("Netwerkfout:", err);
      setError("Er is een netwerkfout opgetreden");
    } finally {
      setLoading(false);
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

      {typeof error === 'string' && (
        <span className={error.includes('succesvol') ? 'text-green-500' : 'text-red-400'}>
          {error}
        </span>
      )}
    </div>
  );
}