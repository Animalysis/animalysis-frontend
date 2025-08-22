import { useEffect, useMemo, useState } from "react";
import { usePets } from "@/providers/pets-provider"
import { useChat } from "@/hooks/use-chat";

// mock hook
function useMockChat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [busy, setBusy] = useState(false);

    const send = async (msg: string) => {
        setMessages(prev => [...prev, { role: "user", content: msg }]);
        setBusy(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { role: "assistant", content: "🐶 Temp response: " + msg }]);
            setBusy(false);
        }, 500); // 0.5ms delay
    };

    return { messages, busy, send };
}

export default function ChatbotWidget({ mock = false }: { mock?: boolean }) {
    const { userId, pets } = usePets();
    const [activePetId, setActivePetId] = useState<string | null>(null);

    // select the first pet as default, we can change this.
    useEffect(() => {
        if (!activePetId && pets.length) {
            setActivePetId(String(pets[0].id));
        }
    }, [pets, activePetId]);

    const animalsForUI = useMemo(() => pets.map(p => ({
        id: String(p.id),
        name: p.name,
        species: p.species,
    })), [pets]);

    // ✅ mock 여부에 따라 hook 교체
    const { messages, busy, send } = mock
        ? useMockChat()
        : useChat({
            userId: userId,
            animalId: activePetId,
        });

    if (!userId) {
        console.log('userId', userId)
        return null;
    }
    if (!pets.length) {
        return (
            <div className="fixed right-5 bottom-5">
                <button className="rounded-full px-4 py-2 bg-emerald-500 text-white shadow">펫을 먼저 등록하세요</button>
            </div>
        );
    }

    return (
        <div className="fixed right-5 bottom-5 bg-white shadow-lg rounded p-3 w-80">
            <select
                value={activePetId ?? ""}
                onChange={(e) => setActivePetId(e.target.value || null)}
                className="mb-2 rounded border px-2 py-1 w-full"
            >
                {animalsForUI.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.species})</option>
                ))}
            </select>

            <div className="h-48 overflow-y-auto border rounded p-2 mb-2 bg-gray-50 text-sm">
                {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                        <span className={m.role === "user" ? "bg-emerald-200 px-2 py-1 rounded inline-block mb-1" : "bg-gray-200 px-2 py-1 rounded inline-block mb-1"}>
                            {m.content}
                        </span>
                    </div>
                ))}
                {busy && <div className="text-gray-400">...</div>}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem("msg") as HTMLInputElement);
                    if (input.value.trim()) {
                        send(input.value.trim());
                        input.value = "";
                    }
                }}
                className="flex gap-2"
            >
                <input name="msg" className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Ask any question!" />
                <button className="bg-emerald-500 text-white px-3 py-1 rounded">Send</button>
            </form>
        </div>
    );
}