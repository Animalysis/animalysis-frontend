import { useEffect, useMemo, useRef, useState } from "react";
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

type Props = {
    mock?: boolean;
    defaultOpen?: boolean;
    launcherSize?: "md" | "lg" | "xl";
    rememberState?: boolean;
    panelWidth?: number;
    panelHeight?: number;
};

export default function ChatbotWidget({
                                          mock = false,
                                          defaultOpen = false,
                                          launcherSize = "lg",
                                          rememberState = true,
                                          panelWidth = 380, // default a bit larger than w-80 (320px)
                                          panelHeight = 320, // default message area height
                                      }: Props) {
    const { userId, pets } = usePets();

    // open/close state with optional persistence
    const storageKey = "chatbot-open";
    const [open, setOpen] = useState<boolean>(() => {
        if (!rememberState) return defaultOpen;
        try {
            const saved = localStorage.getItem(storageKey);
            return saved !== null ? saved === "1" : defaultOpen;
        } catch {
            return defaultOpen;
        }
    });
    useEffect(() => {
        if (!rememberState) return;
        try {
            localStorage.setItem(storageKey, open ? "1" : "0");
        } catch {}
    }, [open, rememberState]);

    // select the first pet as default
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

    // switch between mock/live chat hook
    const { messages, busy, send } = mock
        ? useMockChat()
        : useChat({
            userId: userId ?? "mock-user",
            animalId: activePetId,
        });

    if (!mock && !userId) {
        return null;
    }

    // click outside handler
    const panelRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (!panelRef.current) return;
            if (!panelRef.current.contains(e.target as Node)) {
                // setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);

    // launcher size preset
    const sizeClass =
        launcherSize === "xl"
            ? "w-20 h-20 text-2xl"
            : launcherSize === "lg"
                ? "w-16 h-16 text-xl"
                : "w-12 h-12 text-base";

    // launcher button
    const launcher = (
        <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close chatbot" : "Open chatbot"}
            className={`fixed bottom-6 right-6 z-[100000] rounded-full shadow-xl border bg-emerald-500 text-white flex items-center justify-center hover:brightness-110 ${sizeClass}`}
        >
            {open ? "✖" : "💬"}
        </button>
    );

    // chatbot widget
    const widget = open ? (
        <div
            ref={panelRef}
            className="fixed right-6 bottom-28 bg-white shadow-2xl rounded-xl border z-[99999] pointer-events-auto flex flex-col max-h-[85vh]"
            role="dialog"
            aria-label="Pet assistant"
            style={{ width: panelWidth }}
        >
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
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

            {/* body */}
            {pets.length === 0 ? (
                <div className="p-4">
                    <button className="w-full rounded px-3 py-2 bg-emerald-500 text-white shadow">
                        Please register a pet first
                    </button>
                </div>
            ) : (
                <div className="p-4">
                    <select
                        value={activePetId ?? ""}
                        onChange={(e) => setActivePetId(e.target.value || null)}
                        className="mb-3 w-full rounded border px-3 py-2 text-sm"
                    >
                        {animalsForUI.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.name} ({a.species})
                            </option>
                        ))}
                    </select>

                    <div
                        className="overflow-y-auto border rounded p-3 mb-3 bg-gray-50 text-sm"
                        style={{ height: panelHeight, minHeight: panelHeight }}
                    >
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
                className={
                    m.role === "user"
                        ? "bg-emerald-200 px-3 py-1.5 rounded inline-block mb-1"
                        : "bg-gray-200 px-3 py-1.5 rounded inline-block mb-1"
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
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="Ask any question!"
                        />
                        <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    ) : null;

    return createPortal(
        <>
            {launcher}
            {widget}
        </>,
        document.body
    );
}