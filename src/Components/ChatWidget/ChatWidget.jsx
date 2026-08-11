import { useState, useEffect, useRef } from "react";
import {
    Headset,
    ShieldCheck,
    Minus,
    MoreVertical,
    Paperclip,
    Smile,
    SendHorizontal,
    MessageCircle,
    X
} from "lucide-react";

// Mock automated responses based on input / pill selection
const BOT_RESPONSES = {
    "what is nexusbuild?": "NexusBuild is our premier real-time infrastructure portal. It allows clients to track project statuses, view zoning permits, check construction progress feeds, and monitor financial ledgers securely.",
    "check project status": "To check your project's status, please head over to the /projects directory. If you are a registered client, log into the Client Dashboard to view real-time milestones and status timelines.",
    "view documents": "All project blueprints, structural ratings, and permit approvals are stored securely within the Client Dashboard support section. Log in or reach out to your primary account manager for access links.",
    "default": "Thank you for reaching out to NexusBuild Support! An engineer has been notified, and we typically respond in under 5 minutes. Feel free to request project status updates in the meantime."
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "agent",
            text: "Hello! Welcome to NexusBuild Support. How can I assist you with your project status or documentation today?",
            time: "03:00 AM"
        },
        {
            id: 2,
            sender: "user",
            text: "Hi, I need an update on the zoning permits for the downtown commercial high-rise project.",
            time: "03:01 AM"
        },
        {
            id: 3,
            sender: "agent",
            text: "I can certainly help with that. Let me pull up the file for the downtown project. One moment please.",
            time: "03:01 AM"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const threadEndRef = useRef(null);

    // Auto-scroll to bottom of message thread
    useEffect(() => {
        if (threadEndRef.current) {
            threadEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (textToSend) => {
        const cleanText = textToSend.trim();
        if (!cleanText) return;

        // Append user message
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: cleanText,
            time: timeStr
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: cleanText }),
            });

            if (!response.ok) {
                throw new Error(`Server response error: ${response.status}`);
            }

            const data = await response.json();
            const replyText = data.reply || "Something went wrong, please try again.";

            const botMsg = {
                id: Date.now() + 1,
                sender: "agent",
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("ChatWidget fetch error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: "agent",
                text: "Something went wrong, please try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end font-sans">
            {/* ── Chat Panel ── */}
            {isOpen && (
                <div
                    className="
                        mb-4 bg-white shadow-2xl rounded-xl border border-gray-200
                        flex flex-col overflow-hidden transition-all duration-200 ease-out
                        w-[100vw] h-[100dvh] fixed inset-0 z-[1000]
                        sm:static sm:w-[340px] sm:h-[550px]
                        lg:w-[380px] lg:h-[600px]
                    "
                >
                    {/* Header - Matches Figma #0b1526 */}
                    <div className="bg-[#0b1526] h-[76px] px-4 flex items-center justify-between flex-shrink-0 text-white select-none">
                        <div className="flex items-center gap-3">
                            {/* Avatar - 36x36, fully rounded */}
                            <div className="w-9 h-9 rounded-full bg-[#0b1526] border border-white flex items-center justify-center flex-shrink-0 relative">
                                <Headset size={18} className="text-white" />
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#10b981] border border-[#0b1526]"></span>
                            </div>
                            
                            {/* Meta texts */}
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[14px] font-bold tracking-tight">NexusBuild Support Agent</span>
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-gray-400">
                                    <ShieldCheck size={11} className="text-emerald-500" />
                                    <span>Secure Infrastructure Portal</span>
                                </div>
                                <span className="text-[9px] text-gray-400 leading-none">Typically replies in under 5 mins</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                                aria-label="Minimize Chat"
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                                aria-label="More options"
                            >
                                <MoreVertical size={16} />
                            </button>
                            {/* Mobile-only Close X */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="sm:hidden p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                                aria-label="Close Chat"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Message Thread Area */}
                    <div className="flex-grow bg-[#fafafa] p-4 overflow-y-auto space-y-4 select-text">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-2 max-w-[85%] ${
                                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                                }`}
                            >
                                {/* Agent message gets avatar */}
                                {msg.sender === "agent" ? (
                                    <div className="w-7 h-7 rounded-full bg-[#0b1526] border border-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Headset size={13} className="text-white" />
                                    </div>
                                ) : null}

                                {/* Message bubble - asymmetric corner radius */}
                                <div className="flex flex-col gap-0.5">
                                    <div
                                        className={`
                                            px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm
                                            ${
                                                msg.sender === "agent"
                                                    ? "bg-[#f0f2f5] text-gray-800 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px]"
                                                    : "bg-[#0b1526] text-white rounded-tl-[14px] rounded-bl-[14px] rounded-br-[14px] rounded-tr-[4px]"
                                            }
                                        `}
                                    >
                                        {msg.text}
                                    </div>
                                    <span
                                        className={`text-[9px] text-gray-400 ${
                                            msg.sender === "user" ? "text-right mr-1" : "ml-1"
                                        }`}
                                    >
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex items-start gap-2 max-w-[80%]">
                                <div className="w-7 h-7 rounded-full bg-[#0b1526] border border-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Headset size={13} className="text-white" />
                                </div>
                                <div className="bg-[#f0f2f5] px-3.5 py-2.5 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px] shadow-sm flex items-center gap-1">
                                    <span className="loading loading-dots loading-xs text-gray-500"></span>
                                </div>
                            </div>
                        )}
                        <div ref={threadEndRef} />
                    </div>

                    {/* Bottom Area: Quick replies + input bar */}
                    <div className="bg-white border-t border-gray-200 flex-shrink-0">
                        {/* Quick reply pills */}
                        <div className="px-3 py-2 flex flex-wrap gap-2 border-b border-gray-100 select-none">
                            <button
                                onClick={() => handleSendMessage("What is NexusBuild?")}
                                className="
                                    border border-[#e86930] text-[#e86930] bg-white rounded-full 
                                    text-[11px] font-semibold px-3 py-1 hover:bg-[#e86930]/10 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                "
                            >
                                What is NexusBuild?
                            </button>
                            <button
                                onClick={() => handleSendMessage("Check project status")}
                                className="
                                    border border-[#e86930] text-[#e86930] bg-white rounded-full 
                                    text-[11px] font-semibold px-3 py-1 hover:bg-[#e86930]/10 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                "
                            >
                                Check project status
                            </button>
                            <button
                                onClick={() => handleSendMessage("View documents")}
                                className="
                                    border border-[#e86930] text-[#e86930] bg-white rounded-full 
                                    text-[11px] font-semibold px-3 py-1 hover:bg-[#e86930]/10 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                "
                            >
                                View documents
                            </button>
                        </div>

                        {/* Input bar */}
                        <div className="p-3 flex items-center gap-2.5">
                            <button
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Attach file"
                            >
                                <Paperclip size={18} />
                            </button>
                            
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="
                                    flex-grow bg-transparent text-[13px] text-gray-800 placeholder-gray-400 
                                    focus:outline-none border-none py-1.5 min-h-[44px]
                                "
                            />

                            <button
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Emoji"
                            >
                                <Smile size={18} />
                            </button>

                            {/* Send button - accent `#e86930` */}
                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim()}
                                className="
                                    w-8 h-8 rounded-full bg-[#e86930] flex items-center justify-center flex-shrink-0 
                                    text-white hover:bg-[#d05c28] transition-colors disabled:opacity-40 
                                    disabled:cursor-not-allowed cursor-pointer min-w-[32px] min-h-[32px]
                                "
                                aria-label="Send message"
                            >
                                <SendHorizontal size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Launcher Button ── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                    w-14 h-14 rounded-full bg-[#e86930] shadow-xl flex items-center justify-center
                    text-white hover:bg-[#d05c28] hover:scale-105 active:scale-95
                    transition-all duration-150 cursor-pointer select-none
                "
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
            </button>
        </div>
    );
};

export default ChatWidget;
