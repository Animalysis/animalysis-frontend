import { useCallback, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

export function useChat({ userId, animalId }: { userId: string | null; animalId: string | null }) {
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [busy, setBusy] = useState(false);
    const lastAssistantIdxRef = useRef<number | null>(null);
    const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

    const send = useCallback(async (text: string) => {
        if (!text.trim() || !userId) return;
        setMessages((m) => [...m, { role: "user", content: text }]);
        setBusy(true);

        const body = {
            user_id: userId,
            animal_id: animalId || undefined,
            messages: [{ role: "user", content: text }],
            temperature: 0.7,
            model: "gpt-4.1",
        };

        const resp = await fetch(`${API}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // 인증 쿠키 사용 시
            body: JSON.stringify(body),
        });

        if (!resp.ok) {
            const err = await resp.text();
            setMessages((m) => [...m, { role: "assistant", content: `에러: ${err}` }]);
            setBusy(false);
            return;
        }

        const isStream = resp.headers.get("Content-Type")?.includes("text/plain");

        if (isStream && resp.body) {
            setMessages((m) => {
                const idx = m.length;
                lastAssistantIdxRef.current = idx;
                return [...m, { role: "assistant", content: "" }];
            });

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let acc = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                acc += decoder.decode(value, { stream: true });
                setMessages((m) => {
                    const idx = lastAssistantIdxRef.current!;
                    const copy = [...m];
                    copy[idx] = { role: "assistant", content: acc };
                    return copy;
                });
            }
            setBusy(false);
            return;
        }

        const data = await resp.json();
        setMessages((m) => [...m, { role: "assistant", content: data.content ?? "" }]);
        setBusy(false);
    }, [API, userId, animalId]);

    return { messages, busy, send, setMessages };
}