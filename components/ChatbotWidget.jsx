"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Greetings! I am the Antigravity Assistant, your experts co-pilot for car rentals and project engineering. How may I assist you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/ferrari.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  // Function to get user ID from cookie
  const getUserId = () => {
    if (typeof document === "undefined") return null;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('loggedInUser='));
    if (!cookie) return null;
    try {
      const userData = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      return userData.id;
    } catch (e) { return null; }
  };

  const userId = getUserId();

  // Reset chat logic when user authentication changes
  useEffect(() => {
    // This clears the chat history instantly when the user identity changes
    setMessages([
      { id: 1, text: "Hi! I'm your AI Car Assistant. Looking for a specific car or budget?", isBot: true }
    ]);
    console.log("Chat context cleared due to user change.");
  }, [userId]); // Watches for specific login/logout ID change

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Get token from cookie logic
      const getCookie = (name) => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      const token = getCookie('token');

      // Get or generate sessionId
      let sessionId = localStorage.getItem('chat_session_id');
      if (!sessionId) {
        sessionId = `sess-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_session_id', sessionId);
      }

      const res = await fetch("http://localhost:5000/api/v1/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMsg.text, sessionId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Server responded with an error");
      }
      
      const botMsg = { id: Date.now() + 1, text: data.reply, isBot: true, cars: data.recommendedCars };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now()+2, text: "I'm having trouble connecting to my central node. Please check your network.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        style={{ zIndex: 999999 }}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "500px", zIndex: 999999 }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold text-sm">Antigravity Assistant</h3>
                <p className="text-[10px] text-blue-100 uppercase tracking-wider">Secure Hybrid Node</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isBot ? "items-start" : "items-end"}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${m.isBot ? "bg-white text-gray-800 border border-gray-200" : "bg-blue-600 text-white"}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                </div>
                {/* Render suggested cars inline if AI provided them */}
                {m.cars && m.cars.length > 0 && (
                  <div className="mt-2 w-full flex flex-row gap-2 overflow-x-auto pb-2">
                    {m.cars.map(c => (
                      <div key={c.id} onClick={() => router.push('/cars/'+c.id)} className="flex-shrink-0 w-32 border border-gray-200 bg-white rounded-lg p-2 cursor-pointer hover:shadow-md transition">
                        <img src={getImageUrl(c.image)} alt={c.name} className="w-full h-16 object-cover rounded-md" />
                        <p className="text-xs font-semibold mt-1 truncate">{c.name}</p>
                        <p className="text-xs text-blue-600">₹{c.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="px-4 py-2 rounded-2xl bg-white border border-gray-200 flex items-center gap-2">
                   <Loader2 className="animate-spin text-blue-600" size={16} />
                   <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for an SUV under ₹3000..."
              className="flex-1 outline-none px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-800"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-full bg-blue-600 text-white disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
