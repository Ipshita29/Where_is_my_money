import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

export default function FinanceAIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm your Alimony Finance assistant. Ask me anything about your spending or alimony tracking." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);

        try {
            const response = await api.post("/chat", { message: userMsg });
            setMessages(prev => [...prev, { role: "ai", text: response.data.response }]);
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your API key." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 size-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500 z-50 ${isOpen ? 'bg-expense text-white rotate-90' : 'bg-primary text-background-dark hover:scale-110 active:scale-95'}`}
            >
                <span className="material-symbols-outlined text-3xl font-bold">
                    {isOpen ? "close" : "psychology"}
                </span>
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 size-4 bg-expense border-2 border-background-dark rounded-full animate-ping" />
                )}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-28 right-8 w-[380px] h-[550px] glass-dark border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Finance AI</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="size-1.5 bg-primary rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-primary uppercase">Online & Analyzing</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] leading-relaxed font-medium ${msg.role === 'user'
                                ? 'bg-primary text-background-dark rounded-tr-none shadow-lg'
                                : 'glass border border-white/5 text-slate-200 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="glass border border-white/5 p-3.5 rounded-2xl rounded-tl-none flex gap-1">
                                <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="size-1 bg-primary rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about alimony, spending, risks..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all focus:bg-black/60"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm font-black">send</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
