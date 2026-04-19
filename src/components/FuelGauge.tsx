import { useEffect, useState } from "react";

type Props = {
  percent: number; // 0-100
  liters: number;
  capacity: number;
  range: number;
  low?: boolean;
};

export function FuelGauge({ percent, liters, capacity, range, low }: Props) {
  const size = 260;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));

  // animate the dash on mount/update
  const [animPercent, setAnimPercent] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimPercent(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const dashOffset = circumference - (animPercent / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={low ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1), stroke 300ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Fuel left</div>
        <div className="num text-6xl font-semibold mt-1">
          {liters.toFixed(1)}
          <span className="text-2xl text-muted-foreground font-normal ml-1">L</span>
        </div>
        <div className="num text-sm text-muted-foreground mt-2">
          of {capacity} L · {Math.round(clamped)}%
        </div>
        <div className="num text-sm mt-1">
          ~<span className="font-medium">{Math.round(range)}</span> km range
        </div>
      </div>
    </div>
  );
}
