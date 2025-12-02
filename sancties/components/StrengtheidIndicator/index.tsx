"use client";

import { useEffect, useState } from "react";
import styles from "./strengheid.module.css";

interface StrengtheidData {
  success: boolean;
  strengheid: number;
  percentage: number;
}

interface StrengtheidIndicatorProps {
  refreshTrigger?: number;
}

export default function StrengtheidIndicator({ refreshTrigger }: StrengtheidIndicatorProps) {
  const [data, setData] = useState<StrengtheidData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrengheid = async () => {
      try {
        const response = await fetch("/api/strengheid");
        if (!response.ok) {
          console.error("Failed to fetch strengheid");
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching strengheid:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrengheid();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Strengheid laden...</p>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className={styles.container}>
        <p>Geen strengheid data beschikbaar</p>
      </div>
    );
  }

  const getStrengtheidLabel = (percentage: number) => {
    if (percentage === 0) return "Geen sancties";
    if (percentage < 33) return "Mild";
    if (percentage < 66) return "Gemiddeld";
    return "Streng";
  };

  const getBarColor = (percentage: number) => {
    if (percentage === 0) return "#cbd5e1";
    if (percentage < 33) return "#10b981";
    if (percentage < 66) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Docent Strengheid</h3>
      
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <span className={styles.label}>Gemiddeld Niveau:</span>
          <span className={styles.value}>{data.strengheid.toFixed(2)} / 3</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Status:</span>
          <span className={styles.value}>{getStrengtheidLabel(data.percentage)}</span>
        </div>
      </div>

      <div className={styles.barContainer}>
        <div className={styles.barBackground}>
          <div
            className={styles.barFill}
            style={{
              width: `${data.percentage}%`,
              backgroundColor: getBarColor(data.percentage),
            }}
          >
            <span className={styles.barText}>{data.percentage}%</span>
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#10b981" }} />
          <span>Mild (0-33%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#f59e0b" }} />
          <span>Gemiddeld (33-66%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#ef4444" }} />
          <span>Streng (66-100%)</span>
        </div>
      </div>
    </div>
  );
}
