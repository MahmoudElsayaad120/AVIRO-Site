import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { chatService } from '../services';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUICK_ACTIONS = [
  'Find a product',
  'Check my order',
  'Size guide',
  'Shipping',
  'Returns',
];

export const Chatbot: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen, openSizeGuide } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    chatService.getChatHistory().then((history) => {
      setMessages(history);
    });
  }, []);

  // Auto-scroll to bottom only when new message arrives
  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatbotOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (text === 'Size guide' || text === 'Show size guide table') {
      openSizeGuide('T-Shirts');
    }

    setInputValue('');
    setIsTyping(true);

    // Optimistic user message addition
    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      message: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // Small realistic response pause
      await new Promise((res) => setTimeout(res, 450));
      const { botReply } = await chatService.sendChatMessage(text);
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, botReply]);
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatbotOpen && (
        <button
          id="btn-open-chatbot"
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#181818] hover:bg-[#202020] text-white border border-[#333333] shadow-2xl transition-all duration-300 hover:border-[#555555] group"
          aria-label="Open AVIRO assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase font-['Syne',sans-serif]">
            AVIRO Concierge
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isChatbotOpen && (
        <div
          id="chatbot-window"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] bg-[#111111] border border-[#333333] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#181818] border-b border-[#333333] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white font-['Syne',sans-serif]">
                  AVIRO Concierge
                </h3>
                <p className="text-[10px] text-[#808080] tracking-wider uppercase">
                  Personal Stylist & Wardrobe AI
                </p>
              </div>
            </div>
            <button
              id="btn-close-chatbot"
              onClick={() => setIsChatbotOpen(false)}
              className="p-1 text-[#808080] hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-2 bg-[#181818]/60 border-b border-[#333333] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleSendMessage(action)}
                className="px-2.5 py-1 text-[10px] font-semibold text-[#B3B3B3] hover:text-white bg-[#202020] hover:bg-[#292929] border border-[#333333] whitespace-nowrap transition-colors uppercase tracking-wider"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Scrollable Messages Area */}
          <div
            ref={messagesContainerRef}
            id="chatbot-messages-container"
            className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain bg-[#111111]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#292929] text-white border border-[#444444]'
                      : 'bg-[#181818] text-[#E0E0E0] border border-[#333333]'
                  }`}
                >
                  <p>{msg.message}</p>

                  {/* Optional Product Suggestions */}
                  {msg.productSuggestions && msg.productSuggestions.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-[#333333]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#808080] block">
                        Recommended Pieces:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {msg.productSuggestions.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setIsChatbotOpen(false)}
                            className="bg-[#202020] p-2 border border-[#333333] hover:border-[#555555] transition-colors flex flex-col gap-1 text-left group"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full aspect-square object-cover"
                            />
                            <span className="text-[11px] font-semibold text-white group-hover:text-[#B3B3B3] line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#B3B3B3]">${p.price}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#333333]/50">
                      {msg.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleSendMessage(reply)}
                          className="text-[10px] text-white/80 hover:text-white px-2 py-0.5 bg-[#202020] hover:bg-[#292929] border border-[#333333] transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#808080] mt-1 px-1">{msg.createdAt}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-[#181818] border border-[#333333] w-16">
                <span className="w-1.5 h-1.5 rounded-full bg-[#808080] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#808080] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#808080] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Area at Bottom */}
          <div className="p-3 bg-[#181818] border-t border-[#333333] shrink-0">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] px-3 py-2 focus-within:border-white transition-colors">
              <input
                id="input-chatbot-message"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sizes, fabrics, drops..."
                className="w-full bg-transparent text-xs text-white placeholder-[#808080] focus:outline-none"
              />
              <button
                id="btn-chatbot-send"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="text-[#808080] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
