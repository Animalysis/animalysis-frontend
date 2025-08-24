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
        }, 500);
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
                                          launcherSize = "md",
                                          rememberState = true,
                                          panelWidth = 380,
                                          panelHeight = 320,
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
        try { localStorage.setItem(storageKey, open ? "1" : "0"); } catch {}
    }, [open, rememberState]);

    // select first pet by default
    const [activePetId, setActivePetId] = useState<string | null>(null);
    useEffect(() => {
        if (!activePetId && pets.length) setActivePetId(String(pets[0].id));
    }, [pets, activePetId]);

    const animalsForUI = useMemo(
        () => pets.map(p => ({ id: String(p.id), name: p.name, species: p.species })),
        [pets]
    );

    const { messages, busy, send } = mock
        ? useMockChat()
        : useChat({ userId: userId ?? "mock-user", animalId: activePetId });

    if (!mock && !userId) return null;

    // click outside handler (optional)
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

    // size presets — 살짝 더 작게 조정
    const sizeClass =
        launcherSize === "xl" ? "w-16 h-16 text-xl"
            : launcherSize === "lg" ? "w-14 h-14 text-lg"
                : "w-12 h-12 text-base"; // md

    // 🎨 채팅 아이콘 (이모지 대신)
    const ChatIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-[1.3em] h-[1.3em]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
            <path d="M8 9h8M8 13h5"/>
        </svg>
    );

    // launcher (gradient applied)
    const launcher = (
        <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close chatbot" : "Open chatbot"}
            className={[
                "fixed bottom-6 right-6 z-[100000]",
                "rounded-full shadow-xl border text-white",
                "bg-gradient-primary hover:bg-gradient-secondary",
                "flex items-center justify-center transition",
                sizeClass,
            ].join(" ")}
        >
            {open ? "✖" : ChatIcon}
        </button>
    );

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
                    <button className="w-full rounded px-3 py-2 bg-gradient-primary hover:bg-gradient-secondary text-white shadow">
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

                    {/* messages */}
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

                    {/* input */}
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
                        <button
                            className="px-4 py-2 rounded text-sm text-white bg-gradient-primary hover:bg-gradient-secondary transition"
                        >
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