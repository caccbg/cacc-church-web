import React, { useState, useRef, useEffect } from 'react';
import { sermonAssistant } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Blessings! I am your CACC Ministry Assistant. How can I pray for you or help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sermonAssistant(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm having trouble connecting right now. Please try again." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, but I am unable to respond at the moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto flex flex-col max-h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-4 flex items-center justify-between text-white">
             <div className="flex items-center gap-2">
               <span className="material-symbols-outlined">smart_toy</span>
               <span className="font-bold">Ministry Assistant</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition">
               <span className="material-symbols-outlined text-sm">close</span>
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..." 
              className="flex-1 bg-gray-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white p-2 rounded-full transition shadow-md flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent-red text-white shadow-xl shadow-primary/40 hover:scale-105 transition-transform flex items-center justify-center group"
      >
        <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${isOpen ? 'rotate-180 scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>spark</span>
        <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${!isOpen ? '-rotate-180 scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>close</span>
      </button>
    </div>
  );
};

export default AIAssistant;