// src/hooks/use-activity-metrics.ts
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

type Granularity = "day" | "week" | "month";
type ApiPoint = { name: string; calories: number; heartRate: number; t: string };
type ApiResp = {
    animalId: string;
    granularity: Granularity;
    range: { start: string; end: string };
    data: ApiPoint[];
};

function avg(nums: number[]) {
    const xs = nums.filter((n) => Number.isFinite(n) && n > 0);
    if (!xs.length) return 0;
    return Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
}
function sum(nums: number[]) {
    return nums.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}

export function useActivityMetrics(
    animalId: string | null,
    granularity: Granularity
) {
    // Use the same environment variable as Dashboard / PetsProvider
    // It is recommended to include http:// or https:// in the .env setting
    const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/$/, "");

    // Same as PetsProvider: use Clerk JWT stored in localStorage
    const token =
        (typeof window !== "undefined" && window.localStorage.getItem("clerk_jwt")) ||
        "";

    const query = useQuery<ApiResp>({
        enabled: !!animalId && !!backendUrl,
        queryKey: ["metrics-activity", animalId, granularity],
        queryFn: async () => {
            const url = `${backendUrl}/api/metrics/activity?animalId=${encodeURIComponent(
                animalId!
            )}&granularity=${granularity}`;

            const resp = await fetch(url, {
                method: "GET",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "application/json",
                },
                // credentials is usually unnecessary when using token-based auth.
                // (If using cookie-based auth, you would need `credentials: "include"`)
                // credentials: "include",
            });

            if (!resp.ok) {
                const text = await resp.text().catch(() => "");
                throw new Error(`Failed to load activity metrics (${resp.status}): ${text}`);
            }
            return resp.json();
        },
        refetchInterval: 60_000, // Auto-refresh every 1 minute (remove if not needed)
    });

    const { points, avgHeartRate, totalCalories, activeNow } = useMemo(() => {
        const pts = query.data?.data ?? [];

        const avgHR = avg(pts.map((p) => p.heartRate));
        const totalCal = sum(pts.map((p) => p.calories));

        // "Active now" (demo rule): last bucket is within 24h & HR >= 85
        let active = false;
        if (pts.length) {
            const last = pts[pts.length - 1];
            const lastTime = new Date(last.t).getTime();
            const within24h = Date.now() - lastTime <= 24 * 60 * 60 * 1000;
            if (within24h && last.heartRate >= 85) active = true;
        }

        return { points: pts, avgHeartRate: avgHR, totalCalories: totalCal, activeNow: active };
    }, [query.data]);

    return {
        ...query,
        points,
        avgHeartRate,
        totalCalories,
        activeNow,
    };
}