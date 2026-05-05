import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chat/chatApi";

const SUGGESTED_QUESTIONS = [
  "How to donate blood?",
  "Find blood near me",
  "Emergency help",
  "Check availability",
];

const BotIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="white" fillOpacity="0.15" />
    <path
      d="M8 18c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="11" cy="13" r="1.2" fill="white" />
    <circle cx="17" cy="13" r="1.2" fill="white" />
    <rect x="12" y="7" width="4" height="2.5" rx="1.25" fill="white" />
    <line
      x1="14"
      y1="9.5"
      x2="14"
      y2="11"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M4 4l10 10M14 4L4 14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2 9h14M10 3l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Blood Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const getHistory = () =>
    messages
      .filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = getHistory();
      const data = await sendChatMessage(trimmed, history);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        {isOpen ? <CloseIcon /> : <BotIcon />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9998] w-[360px] max-h-[520px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-red-500 text-white p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <BotIcon />
            </div>
            <div>
              <p className="font-semibold text-sm">Blood Assistant</p>
              <p className="text-xs opacity-80">🟢 Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-sm rounded-lg ${
                    msg.role === "user"
                      ? "bg-red-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm text-xs text-gray-500">
                  typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs border border-red-500 text-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-2 border-t flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm rounded-full border focus:outline-none focus:border-red-500 bg-gray-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                input.trim()
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
