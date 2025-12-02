"use client";
/* Alles van Tomas */

import { useEffect, useState, useRef, ChangeEvent } from "react";
import styles from "./rad.module.css";

interface Sanctie {
  id: number;
  naam: string;
  niveau: number;
}

const getKleur = (index: number) => {
  const kleuren = ["#FDF3E7", "#E0E7FF", "#FEE2E2", "#FEF3C7", "#D1FAE5"];
  return kleuren[index % kleuren.length];
};

export default function Rad() {
  const [loading, setLoading] = useState(true);
  const [niveau, setNiveau] = useState<number>();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>("");
  const [allSancties, setAllSancties] = useState<Sanctie[]>([]);
  const [sancties, setSancties] = useState<Sanctie[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const FetchSancties = async () => {
      const response = await fetch("/api/sancties");

      try {
        const data = await response.json();

        if (!response.ok) {
          if (data?.message) alert(data.message);

          throw new Error(
            "Something went wrong fetching sancties: " +
              (data?.message || (await response.text()))
          );
        }

        if (!data.success) return alert(data.message);

        if (data?.sancties) {
          const sancties = data.sancties.map(
            ({
              ID,
              ...rest
            }: {
              ID: number;
              naam: string;
              niveau: number;
            }) => ({
              ...rest,
              id: ID,
            })
          );

          setAllSancties(sancties);
          setSancties(sancties);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      } finally {
        setLoading(false);
      }
    };

    FetchSancties();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || sancties.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const segmentAngleRad = (2 * Math.PI) / sancties.length;
    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;

    let fontSize = 14;
    if (sancties.length > 20) fontSize = 10;
    if (sancties.length > 40) fontSize = 8;
    ctx.font = `bold ${fontSize}px Arial`;

    ctx.clearRect(0, 0, size, size);

    sancties.forEach((sanctie, i) => {
      const startAngle = i * segmentAngleRad;
      const endAngle = (i + 1) * segmentAngleRad;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = getKleur(i);
      ctx.fill();
      ctx.strokeStyle = "#ccc";
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngleRad / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";
      ctx.fillText(sanctie.naam, radius - 15, 0);
      ctx.restore();
    });
  }, [sancties]);

  useEffect(() => {
    const newSancties = allSancties.filter(
      (sanctie) => sanctie.niveau === niveau
    );

    if (newSancties?.length > 1) setSancties(newSancties);
    else setSancties(allSancties);
  }, [niveau]);

  const ChangeNiveau = (e: ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    const data = element.value;

    const highestNiveau = Math.max(
      ...allSancties
        .map((sanctie) => sanctie.niveau)
        .filter(
          (niveau, _, alleNiveaus) =>
            alleNiveaus.filter((x) => x === niveau).length >= 2
        )
    );

    console.log(data && Number.isFinite(Number(data)) ? Number(data) : 0);
    setNiveau(data && Number.isFinite(Number(data)) ? Number(data) : 0);

    if (data && Number.isFinite(Number(data))) {
      if (Number(data) > highestNiveau) element.value = "";
      else if (Number(data) < 0) element.value = "0";
    }
  };

  const SpinWheel = () => {
    if (isSpinning || sancties.length < 2) return;

    setIsSpinning(true);
    setResult("");

    const segmentAngleDeg = 360 / sancties.length;
    const extraRotation = (Math.floor(Math.random() * 6) + 8) * 360;
    const winningIndex = Math.floor(Math.random() * sancties.length);

    const targetAngle = winningIndex * segmentAngleDeg + segmentAngleDeg / 2;
    const randomOffset = (Math.random() - 0.5) * (segmentAngleDeg * 0.8);
    const finalRotation = extraRotation + (270 - targetAngle - randomOffset);

    setRotation(finalRotation);

    setTimeout(() => {
      const winner = sancties[winningIndex];
      setResult(winner.naam);
      setIsSpinning(false);
      console.log("Resultaat:", winner.naam);
    }, 4000);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <span>Sancties aan het laden...</span>
      ) : sancties.length < 2 ? (
        <span>Niet genoeg sancties om aan een rad te draaien.</span>
      ) : (
        <>
          <div className={styles.inputGroup}>
            <span>Niveau: </span>
            <input
              type="number"
              className={styles.formControl}
              placeholder="Niveau"
              onChange={(e) => ChangeNiveau(e)}
              min={0}
              max={Math.max(
                ...allSancties
                  .map((sanctie) => sanctie.niveau)
                  .filter(
                    (niveau, _, alleNiveaus) =>
                      alleNiveaus.filter((x) => x === niveau).length >= 2
                  )
              )}
            />
          </div>

          <div className={styles.wheelContainer}>
            <div className={styles.pointer}>▼</div>

            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className={styles.wheel}
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            />

            <button
              onClick={SpinWheel}
              disabled={isSpinning}
              className={styles.spinButton}
              aria-label="Draai aan het rad"
            />
          </div>

          {result && <h2 className={styles.result}>Resultaat: {result}</h2>}
        </>
      )}
    </div>
  );
}
