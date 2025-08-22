import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePets } from "@/providers/pets-provider";
import { useChat } from "@/hooks/use-chat";

// Mock hook for testing
function useMockChat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [busy, setBusy] = useState(false);

    const send = async (msg: string) => {
        setMessages(prev => [...prev, { role: "user", content: msg }]);
        setBusy(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "assistant", content: "🐶 Temp response: " + msg }]);
            setBusy(false);
        }, 500); // Simulate 0.5s delay
    };

    return { messages, busy, send };
}

export default function ChatbotWidget({ mock = false }: { mock?: boolean }) {
    const { userId, pets } = usePets();

    // Portal / toggle state
    const [open, setOpen] = useState(true);

    // Select the first pet as default if available
    const [activePetId, setActivePetId] = useState<string | null>(null);
    useEffect(() => {
        if (!activePetId && pets.length) {
            setActivePetId(String(pets[0].id));
        }
    }, [pets, activePetId]);

    const animalsForUI = useMemo(
        () =>
            pets.map(p => ({
                id: String(p.id),
                name: p.name,
                species: p.species,
            })),
        [pets]
    );

    // Switch between mock and live hook
    const { messages, busy, send } = mock
        ? useMockChat()
        : useChat({
            userId: userId ?? "mock-user", // Use real userId in live mode, fallback in mock
            animalId: activePetId,
        });

    // Guard for live mode only (mock always works)
    if (!mock && !userId) {
        return null;
    }

    // Launcher button (open/close toggle)
    const launcher = (
        <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label="Open chatbot"
            className="fixed bottom-6 right-6 z-[100000] rounded-full shadow-xl border bg-emerald-500 text-white w-12 h-12 flex items-center justify-center hover:brightness-110"
        >
            {open ? "✖" : "💬"}
        </button>
    );

    // Chatbot widget UI
    const widget = open ? (
        <div
            className="fixed right-6 bottom-24 w-80 bg-white shadow-2xl rounded-xl border z-[99999] pointer-events-auto"
            role="dialog"
            aria-label="Pet assistant"
        >
            <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="font-semibold text-sm">PetFit Pro Assistant</div>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-slate-500 hover:text-slate-700"
                    aria-label="Close chatbot"
                >
                    ✖
                </button>
            </div>

            {pets.length === 0 ? (
                <div className="p-3">
                    <button className="w-full rounded px-3 py-2 bg-emerald-500 text-white shadow">
                        Please register a pet first
                    </button>
                </div>
            ) : (
                <>
                    <div className="p-3">
                        <select
                            value={activePetId ?? ""}
                            onChange={(e) => setActivePetId(e.target.value || null)}
                            className="mb-2 w-full rounded border px-2 py-1 text-sm"
                        >
                            {animalsForUI.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name} ({a.species})
                                </option>
                            ))}
                        </select>

                        <div className="h-48 overflow-y-auto border rounded p-2 mb-2 bg-gray-50 text-sm">
                            {messages.map((m, i) => (
                                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <span
                      className={
                          m.role === "user"
                              ? "bg-emerald-200 px-2 py-1 rounded inline-block mb-1"
                              : "bg-gray-200 px-2 py-1 rounded inline-block mb-1"
                      }
                  >
                    {m.content}
                  </span>
                                </div>
                            ))}
                            {busy && <div className="text-gray-400">...</div>}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem("msg") as HTMLInputElement;
                                if (input.value.trim()) {
                                    send(input.value.trim());
                                    input.value = "";
                                }
                            }}
                            className="flex gap-2"
                        >
                            <input
                                name="msg"
                                className="flex-1 border rounded px-2 py-1 text-sm"
                                placeholder="Ask any question!"
                            />
                            <button className="bg-emerald-500 text-white px-3 py-1 rounded">Send</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    ) : null;

    // Always render on top: attach to body with high z-index
    return createPortal(
        <>
            {launcher}
            {widget}
        </>,
        document.body
    );
}