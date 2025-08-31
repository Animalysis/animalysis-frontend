// src/providers/pets-provider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

type PetRow = {
    id: string;
    name: string;
    species?: string;
    breed?: string;
    weight?: number;
    age?: number;
    birth_date?: string;
    user_id: string;
};

type Ctx = {
    userId: string | null;
    pets: PetRow[];
    isLoading: boolean;
    refresh: () => Promise<void>;
};

const Ctx = createContext<Ctx>({
    userId: null,
    pets: [],
    isLoading: true,
    refresh: async () => {},
});

export function PetsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const [userId, setUserId] = useState<string | null>(null);
    const [pets, setPets] = useState<PetRow[]>([]);
    const [isLoading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const refresh = async () => {
        setLoading(true);
        try {
            // If Clerk user is not logged in → reset and exit
            if (!user) {
                setUserId(null);
                setPets([]);
                return;
            }

            // 1) Store token & user info (same logic as Dashboard)
            const token = window.localStorage.getItem("clerk_jwt") ?? "";
            window.localStorage.setItem("clerk_id", user.id);
            window.localStorage.setItem("clerk_name", user.firstName || user.fullName || "");

            // 2) Fetch user from backend (if not found, Dashboard usually creates it,
            //    but here we only need the id)
            const uRes = await fetch(`${backendUrl}/api/users`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!uRes.ok) {
                console.warn("[PetsProvider] /api/users failed:", uRes.status, await uRes.text());
                setPets([]);
                return;
            }

            const uData = await uRes.json();
            const uid = uData?.id as string | undefined;
            if (!uid) {
                console.warn("[PetsProvider] no user id returned from backend");
                setPets([]);
                return;
            }
            setUserId(uid);

            // Fetch pets belonging to the user
            const pRes = await fetch(`${backendUrl}/api/users/${encodeURIComponent(uid)}/pets`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!pRes.ok) {
                console.warn("[PetsProvider] /api/users/:id/pets failed:", pRes.status, await pRes.text());
                setPets([]);
                return;
            }

            const list = (await pRes.json()) as unknown;
            setPets(Array.isArray(list) ? (list as PetRow[]) : []);
        } catch (err) {
            console.error("[PetsProvider] fetch error:", err);
            setPets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, [user?.id]);

    return (
        <Ctx.Provider value={{ userId, pets, isLoading, refresh }}>
            {children}
        </Ctx.Provider>
    );
}

export const usePets = () => useContext(Ctx);