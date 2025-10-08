"use client";

import { FormEvent, useState } from "react";

export default function New() {
  const [error, setError] = useState<string | boolean>(false);

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    setError(false);

    const form = (e.target as HTMLElement).closest("form");
    const input = form?.querySelector("input") as HTMLInputElement;

    const name = input.value;
    if (!name) return setError("Een of meerdere velden zijn niet ingevuld");

    console.log(name);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <form
        className="flex flex-row items-center justify-center gap-2 mb-3"
        onSubmit={submitForm}
      >
        <input
          type="text"
          className="form-control w-fit"
          id="usernameInput"
          placeholder="Naam"
        />

        <button type="submit" className="btn btn-primary">
          Aanmaken
        </button>
      </form>

      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}
