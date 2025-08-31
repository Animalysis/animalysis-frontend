// src/components/dashboard/ActivityChart.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usePets } from "@/providers/pets-provider";
import { useActivityMetrics } from "@/hooks/use-activity-metrics";

type Granularity = "day" | "week" | "month";
type ApiPoint = { name: string; calories: number; heartRate: number; t: string };

export default function ActivityChart() {
  const { pets } = usePets();
  const [animalId, setAnimalId] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<Granularity>("week");

  // Default selection: pick the first pet as soon as it's available
  useEffect(() => {
    if (!animalId && pets.length) setAnimalId(String(pets[0].id));
  }, [pets, animalId]);

  // Fetch activity points + computed summary (avg HR, total calories, active now)
  const { points, isLoading, isError } = useActivityMetrics(animalId, granularity);

  return (
      <Card className="col-span-2 border border-white/20 bg-gradient-glass backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>

          <div className="flex gap-2">
            {/* Pet selector */}
            <select
                className="border rounded px-2 py-1 text-sm bg-white/70 backdrop-blur-sm"
                value={animalId ?? ""}
                onChange={(e) => setAnimalId(e.target.value || null)}
            >
              {pets.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} {p.species ? `(${p.species})` : ""}
                  </option>
              ))}
            </select>

            {/* Granularity tabs */}
            <div className="inline-flex rounded-lg border border-white/30 overflow-hidden bg-white/50 backdrop-blur-sm">
              {(["day", "week", "month"] as Granularity[]).map((g) => {
                const active = granularity === g;
                return (
                    <button
                        key={g}
                        onClick={() => setGranularity(g)}
                        className={[
                          "px-3 py-1.5 text-sm transition",
                          active
                              ? // active button matches existing brand tokens
                              "bg-health-primary text-white shadow-sm"
                              : "bg-transparent text-slate-700 hover:bg-white",
                        ].join(" ")}
                    >
                      {g === "day" ? "Day" : g === "week" ? "Week" : "Month"}
                    </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
              <div className="h-[300px] grid place-items-center text-sm text-muted-foreground">
                Loading…
              </div>
          ) : isError ? (
              <div className="h-[300px] grid place-items-center text-sm text-red-500">
                Failed to load
              </div>
          ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={points}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--muted-foreground))"
                        opacity={0.3}
                    />
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "var(--shadow-card)",
                        }}
                        labelFormatter={(label, payload) => {
                          const p = payload?.[0]?.payload as ApiPoint | undefined;
                          if (!p) return label;
                          const d = new Date(p.t);
                          return `${label} • ${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="hsl(var(--health-secondary))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--health-secondary))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--health-secondary))",
                          strokeWidth: 2,
                        }}
                        name="Calories Burned"
                    />
                    <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="hsl(var(--health-primary))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--health-primary))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--health-primary))",
                          strokeWidth: 2,
                        }}
                        name="Heart Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-health-secondary" />
                    <span className="text-sm text-muted-foreground">Calories Burned</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-health-primary" />
                    <span className="text-sm text-muted-foreground">Heart Rate</span>
                  </div>
                </div>
              </>
          )}
        </CardContent>
      </Card>
  );
}