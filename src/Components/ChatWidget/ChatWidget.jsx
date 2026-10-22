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
import { getApiUrl } from "../../config/api.js";
import { useTheme } from "../../Context/ThemeContext";

const QUICK_EMOJIS = ["😊", "👍", "❤️", "🏢", "🏗️", "🏠", "📍", "🔑", "💼", "✨", "💬", "📞", "🤝", "🎉", "⚡", "📋"];
const MESSAGE_REACTIONS = ["👍", "❤️", "🏢", "😊", "🔥"];

/**
 * Guarantees that the assistant message starts with "Assalamu Alaikum"
 */
const enforceIslamicGreeting = (text = '') => {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
        return "Assalamu Alaikum! How can I assist you with NexusBuild developments today?";
    }

    const greetingRegex = /^(assalamu\s*['’]?\s*alaikum|assalamualikum|assalamu\s*al\s*aikum|as-salamu\s*alaykum)/i;
    if (greetingRegex.test(trimmed)) {
        return trimmed;
    }

    return `Assalamu Alaikum! ${trimmed}`;
};

const ChatWidget = () => {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    
    // Clean initial state with single welcome message (no pre-built fake dialog)
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "agent",
            text: "Assalamu Alaikum! Welcome to NexusBuild Support. How can I assist you with your project status or documentation today?",
            time: "03:00 AM",
            reactions: {}
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);

    const threadEndRef = useRef(null);
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Auto-scroll to bottom of message thread
    useEffect(() => {
        if (threadEndRef.current) {
            threadEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEmojiPicker]);

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
            time: timeStr,
            reactions: {}
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setShowEmojiPicker(false);
        setIsTyping(true);

        try {
            const response = await fetch(getApiUrl("/api/chat"), {
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
            const rawReply = data.reply || "Something went wrong, please try again.";
            const replyText = enforceIslamicGreeting(rawReply);

            const botMsg = {
                id: Date.now() + 1,
                sender: "agent",
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: {}
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("ChatWidget fetch error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: "agent",
                text: enforceIslamicGreeting("I am currently experiencing trouble connecting to our live service. Please try again shortly or reach our team at info@nexusbuild.com."),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: {}
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

    const handleAddEmoji = (emoji) => {
        setInputValue((prev) => prev + emoji);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleToggleReaction = (msgId, emoji) => {
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== msgId) return msg;
                const existingCount = msg.reactions?.[emoji] || 0;
                const newReactions = { ...msg.reactions };
                if (existingCount > 0) {
                    delete newReactions[emoji];
                } else {
                    newReactions[emoji] = 1;
                }
                return { ...msg, reactions: newReactions };
            })
        );
        setActiveReactionMsgId(null);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end font-sans">
            {/* ── Chat Panel ── */}
            {isOpen && (
                <div
                    className={`
                        mb-4 shadow-2xl rounded-2xl border
                        flex flex-col overflow-hidden transition-all duration-200 ease-out
                        w-[100vw] h-[100dvh] fixed inset-0 z-[1000]
                        sm:static sm:w-[350px] sm:h-[560px]
                        lg:w-[380px] lg:h-[600px]
                        ${isDark 
                            ? "bg-[#0b1329] border-slate-700/80 text-slate-100" 
                            : "bg-white border-gray-200 text-gray-800"
                        }
                    `}
                >
                    {/* Header - Adapts to Dark/Light Theme */}
                    <div className={`
                        h-[76px] px-4 flex items-center justify-between flex-shrink-0 select-none
                        ${isDark 
                            ? "bg-[#070c18] border-b border-slate-800 text-white" 
                            : "bg-[#0b1526] text-white"
                        }
                    `}>
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-[#0b1526] border border-white/60 flex items-center justify-center flex-shrink-0 relative">
                                <Headset size={18} className="text-white" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#0b1526]"></span>
                            </div>
                            
                            {/* Meta texts */}
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[14px] font-bold tracking-tight">NexusBuild Support Agent</span>
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                                    <ShieldCheck size={11} className="text-emerald-400" />
                                    <span>Verified Support Assistant</span>
                                </div>
                                <span className="text-[9px] text-gray-400 leading-none">Answers instantly • Live Supabase Catalog</span>
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
                    <div className={`
                        flex-grow p-4 overflow-y-auto space-y-4 select-text
                        ${isDark ? "bg-[#080d1a]" : "bg-[#fafafa]"}
                    `}>
                        {messages.map((msg) => {
                            const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
                            const isUser = msg.sender === "user";

                            return (
                                <div
                                    key={msg.id}
                                    className={`relative group flex items-start gap-2 max-w-[88%] ${
                                        isUser ? "ml-auto flex-row-reverse" : ""
                                    }`}
                                >
                                    {/* Agent Avatar */}
                                    {!isUser && (
                                        <div className={`
                                            w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5
                                            ${isDark 
                                                ? "bg-[#0e172a] border-slate-700 text-white" 
                                                : "bg-[#0b1526] border-white text-white"
                                            }
                                        `}>
                                            <Headset size={13} />
                                        </div>
                                    )}

                                    {/* Bubble + Timestamp + Reactions */}
                                    <div className="flex flex-col gap-1 max-w-full">
                                        <div
                                            className={`
                                                relative px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm break-words
                                                ${isUser
                                                    ? isDark
                                                        ? "bg-[#e86930] text-white rounded-tl-[14px] rounded-bl-[14px] rounded-br-[14px] rounded-tr-[4px]"
                                                        : "bg-[#0b1526] text-white rounded-tl-[14px] rounded-bl-[14px] rounded-br-[14px] rounded-tr-[4px]"
                                                    : isDark
                                                        ? "bg-[#182338] text-slate-100 border border-slate-700/60 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px]"
                                                        : "bg-[#f0f2f5] text-gray-800 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px]"
                                                }
                                            `}
                                        >
                                            {msg.text}
                                        </div>

                                        {/* Reactions Pill Display */}
                                        {hasReactions && (
                                            <div className={`flex flex-wrap gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                                                {Object.entries(msg.reactions).map(([emoji, count]) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleToggleReaction(msg.id, emoji)}
                                                        className={`
                                                            inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer
                                                            ${isDark 
                                                                ? "bg-[#162035] border-slate-700 text-slate-200 hover:border-slate-500" 
                                                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                                                            }
                                                        `}
                                                        title="Click to remove or toggle reaction"
                                                    >
                                                        <span>{emoji}</span>
                                                        <span className="text-[10px] font-semibold">{count}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Meta row: Timestamp + Reaction Trigger Button */}
                                        <div className={`flex items-center gap-1.5 text-[9px] ${isUser ? "justify-end mr-1" : "ml-1"}`}>
                                            <span className={isDark ? "text-slate-400" : "text-gray-400"}>
                                                {msg.time}
                                            </span>

                                            {/* Hover reaction button */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                                                    className={`
                                                        p-0.5 rounded transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer
                                                        ${isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"}
                                                    `}
                                                    title="Add reaction"
                                                    aria-label="Add reaction"
                                                >
                                                    <Smile size={12} />
                                                </button>

                                                {/* Mini reaction popup on message */}
                                                {activeReactionMsgId === msg.id && (
                                                    <div className={`
                                                        absolute bottom-5 ${isUser ? "right-0" : "left-0"} z-30
                                                        flex items-center gap-1 p-1 rounded-full shadow-lg border
                                                        ${isDark ? "bg-[#182338] border-slate-700" : "bg-white border-gray-200"}
                                                    `}>
                                                        {MESSAGE_REACTIONS.map((em) => (
                                                            <button
                                                                key={em}
                                                                onClick={() => handleToggleReaction(msg.id, em)}
                                                                className="hover:scale-125 transition-transform text-xs p-1 cursor-pointer"
                                                            >
                                                                {em}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex items-start gap-2 max-w-[80%]">
                                <div className={`
                                    w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5
                                    ${isDark ? "bg-[#0e172a] border-slate-700 text-white" : "bg-[#0b1526] border-white text-white"}
                                `}>
                                    <Headset size={13} />
                                </div>
                                <div className={`
                                    px-3.5 py-2.5 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px] shadow-sm flex items-center gap-1
                                    ${isDark ? "bg-[#182338] border border-slate-700/60" : "bg-[#f0f2f5]"}
                                `}>
                                    <span className={`loading loading-dots loading-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}></span>
                                </div>
                            </div>
                        )}
                        <div ref={threadEndRef} />
                    </div>

                    {/* Bottom Area: Quick replies + Emoji picker + input bar */}
                    <div className={`
                        flex-shrink-0 border-t relative
                        ${isDark 
                            ? "bg-[#0b1329] border-slate-800" 
                            : "bg-white border-gray-200"
                        }
                    `}>
                        {/* Interactive Emoji Picker Popover */}
                        {showEmojiPicker && (
                            <div
                                ref={emojiPickerRef}
                                className={`
                                    absolute bottom-[100%] right-3 mb-2 p-2.5 rounded-xl shadow-2xl border z-50
                                    grid grid-cols-8 gap-1.5 w-[280px]
                                    ${isDark 
                                        ? "bg-[#10192e] border-slate-700 text-slate-100" 
                                        : "bg-white border-gray-200 text-gray-800"
                                    }
                                `}
                            >
                                {QUICK_EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleAddEmoji(emoji)}
                                        className="text-lg p-1 rounded hover:bg-primary/20 active:scale-95 transition-all text-center cursor-pointer"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick reply pills */}
                        <div className={`
                            px-3 py-2 flex flex-wrap gap-2 border-b select-none
                            ${isDark ? "border-slate-800/80" : "border-gray-100"}
                        `}>
                            <button
                                onClick={() => handleSendMessage("What is NexusBuild?")}
                                className={`
                                    border rounded-full text-[11px] font-semibold px-3 py-1 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                    ${isDark 
                                        ? "border-[#e86930] text-[#ff8652] bg-[#10192e] hover:bg-[#e86930]/20" 
                                        : "border-[#e86930] text-[#e86930] bg-white hover:bg-[#e86930]/10"
                                    }
                                `}
                            >
                                What is NexusBuild?
                            </button>
                            <button
                                onClick={() => handleSendMessage("Check project status")}
                                className={`
                                    border rounded-full text-[11px] font-semibold px-3 py-1 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                    ${isDark 
                                        ? "border-[#e86930] text-[#ff8652] bg-[#10192e] hover:bg-[#e86930]/20" 
                                        : "border-[#e86930] text-[#e86930] bg-white hover:bg-[#e86930]/10"
                                    }
                                `}
                            >
                                Check project status
                            </button>
                            <button
                                onClick={() => handleSendMessage("View documents")}
                                className={`
                                    border rounded-full text-[11px] font-semibold px-3 py-1 
                                    transition-colors cursor-pointer active:scale-95 duration-100
                                    ${isDark 
                                        ? "border-[#e86930] text-[#ff8652] bg-[#10192e] hover:bg-[#e86930]/20" 
                                        : "border-[#e86930] text-[#e86930] bg-white hover:bg-[#e86930]/10"
                                    }
                                `}
                            >
                                View documents
                            </button>
                        </div>

                        {/* Input bar */}
                        <div className="p-3 flex items-center gap-2.5">
                            <button
                                className={`p-1 transition-colors ${isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"}`}
                                aria-label="Attach file"
                                title="Attach file"
                            >
                                <Paperclip size={18} />
                            </button>
                            
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className={`
                                    flex-grow bg-transparent text-[13px] 
                                    focus:outline-none border-none py-1.5 min-h-[44px]
                                    ${isDark 
                                        ? "text-slate-100 placeholder-slate-500" 
                                        : "text-gray-800 placeholder-gray-400"
                                    }
                                `}
                            />

                            {/* Emoji picker button */}
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                                className={`
                                    p-1 transition-colors cursor-pointer
                                    ${showEmojiPicker 
                                        ? "text-[#e86930]" 
                                        : isDark 
                                            ? "text-slate-400 hover:text-slate-200" 
                                            : "text-gray-400 hover:text-gray-600"
                                    }
                                `}
                                aria-label="Emoji"
                                title="Insert emoji"
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

            {/* ── Floating Launcher Button ── */}
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
