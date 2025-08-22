"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {mockPets} from "../mock/mockPets";

type PetRow = { id: string; name: string; species?: string; birth_date?: string; user_id: string }; // ← user_id로 통일

type Ctx = {
    userId: string | null;
    pets: PetRow[];
    isLoading: boolean;
    refresh: () => Promise<void>;
};

const Ctx = createContext<Ctx>({
    userId: null, pets: [], isLoading: true, refresh: async () => {
    }
});

export function PetsProvider({children}: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [pets, setPets] = useState<PetRow[]>([]);
    const [isLoading, setLoading] = useState(true);

    const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || ""; // 예: http://localhost:3000

    async function getUser() {
        try {
            const res = await fetch(`${API}/api/me`, {credentials: "include"});
            if (!res.ok) return null;
            const me = await res.json();
            return me?.id ?? null;
        } catch {
            return null;
        }
    }

    // const refresh = async () => {
    //     setLoading(true);
    //     try {
    //         const uid = await getUser();
    //         setUserId(uid);
    //         if (!uid) {
    //             setPets([]);
    //             return;
    //         }
    //         const res = await fetch(`${API}/api/pets`, {credentials: "include"});
    //         // 서버: { data: [...] }
    //         const json = await res.json();
    //         const list = Array.isArray(json?.data) ? json.data : [];
    //         setPets(list);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // using mock data instead of server APIs
    const refresh = async () => {
        setLoading(true);
        try {
            // mock userId
            const uid = "u1";
            setUserId(uid);

            // mockPets
            setPets(mockPets);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    return <Ctx.Provider value={{userId, pets, isLoading, refresh}}>
        {children}
    </Ctx.Provider>;
}

export const usePets = () => useContext(Ctx);