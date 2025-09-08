"use client";
interface Props {
  naam?: string;
}

export default function Button({ naam = "Geen naam ingevoerd" }: Props) {
  function handleOnClick1() {
    //
  }

  return (
    <button className="btn btn-primary" onClick={handleOnClick1}>
      {naam}
    </button>
  );
}
