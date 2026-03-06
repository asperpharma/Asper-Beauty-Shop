import { useState } from "react";
import { Send, X, Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Marhaba! 🌿 I am Dr. Sami, your Digital Pharmacist. I am honored to serve you today. What is your primary skin concern?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!supabase) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        {
          role: "assistant",
          content: "The pharmacy connection is not configured. Please add Supabase URL and key.",
        },
      ]);
      setInput("");
      return;
    }

    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.content,
      }));
      const { data, error } = await supabase.functions.invoke("beauty-assistant", {
        body: { query: input, messages: history },
      });

      if (error) throw error;

      const reply = data?.reply ?? data?.response ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply || "Please try again." }]);
    } catch (err) {
      console.error("Concierge Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "My apologies. The pharmacy connection is weak. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-maroon hover:bg-maroon/90 text-white p-4 rounded-full shadow-2xl border-2 border-shiny-gold transition-all duration-300 hover:scale-105"
          aria-label="Open Asper Concierge"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] h-[600px] bg-soft-ivory rounded-2xl shadow-2xl border border-shiny-gold flex flex-col overflow-hidden">
          <div className="bg-maroon p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full">
                <ShieldCheck className="w-5 h-5 text-shiny-gold" />
              </div>
              <div>
                <h3 className="text-white font-heading font-bold text-lg">Asper Concierge</h3>
                <p className="text-white/80 text-xs">Pharmacist-Curated Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soft-ivory">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-maroon text-white rounded-br-none"
                      : "bg-white border border-shiny-gold text-dark-charcoal rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-shiny-gold px-4 py-3 rounded-xl rounded-bl-none">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-shiny-gold rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-shiny-gold rounded-full animate-bounce [animation-delay:100ms]" />
                    <span className="w-2 h-2 bg-shiny-gold rounded-full animate-bounce [animation-delay:200ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about skin concerns..."
                className="flex-1 bg-soft-ivory border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-shiny-gold focus:ring-1 focus:ring-shiny-gold text-dark-charcoal"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-maroon text-white p-3 rounded-lg hover:bg-maroon/90 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center mt-2 text-[10px] text-gray-400">
              Powered by Authentic Intelligence ™
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
