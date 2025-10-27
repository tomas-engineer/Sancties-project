"use client";
import { useState } from "react";
import styles from "./rad.module.css";

export default function Rad() {
  const [niveau, setNiveau] = useState<number>();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>("");

  // Make it niveau based!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const [sancties, setSancties] = useState([
    {
      id: 1,
      naam: "Bord vegen",
      niveau: 1,
    },
    {
      id: 2,
      naam: "Nablijven",
      niveau: 2,
    },
    {
      id: 3,
      naam: "Koffie halen",
      niveau: 1,
    },
    {
      id: 4,
      naam: "Snoep kopen",
      niveau: 1,
    },
  ]);

  const segmentAngle = 360 / sancties.length;

  const SpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult("");

    const extraRotation = 1800 + Math.random() * 1800;
    const newRotation = rotation + extraRotation;

    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const adjustedRotation = (360 - normalizedRotation) % 360;
      const winningIndex =
        (((Math.floor(adjustedRotation / segmentAngle) - 1) % sancties.length) +
          sancties.length) %
        sancties.length;

      const winner = sancties[winningIndex];

      setResult(winner.naam);
      setIsSpinning(false);
      console.log("Resultaat:", winner.naam);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {sancties.length < 2 ? (
        <span>Niet genoeg sancties om aan een rad te draaien</span>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="number"
              className="form-control w-fit"
              placeholder="Niveau"
              onChange={(e) => setNiveau(Number(e.target.value))}
            />
          </div>

          <div className={styles.wheelWrapper}>
            <div
              className={styles.container}
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {sancties.map((sanctie, index) => {
                const segmentRotation = index * segmentAngle;
                const skewAngle = -(90 - segmentAngle);

                return (
                  <div
                    key={sanctie.id}
                    className={styles.segment}
                    style={{
                      transform: `rotate(${segmentRotation}deg) skewY(${skewAngle}deg)`,
                    }}
                  >
                    <div
                      className={styles.segmentText}
                      style={{
                        transform: `skewY(${90 - segmentAngle}deg) rotate(${
                          segmentAngle / 2
                        }deg)`,
                      }}
                    >
                      {sanctie.naam}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={SpinWheel}
              disabled={isSpinning}
              className={styles.centerPin}
              style={{ cursor: isSpinning ? "not-allowed" : "pointer" }}
            />
            <div className={styles.pointer} />
          </div>

          {result && <span>Resultaat: {result}</span>}
        </>
      )}
    </div>
  );
}
