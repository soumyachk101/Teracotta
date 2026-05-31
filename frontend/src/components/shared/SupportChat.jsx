import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { aiService } from '../../services/product.service';
import { cn } from '../../utils/cn';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I\'m Mala, your shopping assistant. How can I help you find the perfect terracotta piece today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await aiService.chat(text, conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || data }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please email us at contact@mittikala.com for assistance.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-warm-lg flex items-center justify-center transition-all duration-300',
          isOpen ? 'bg-stone-800 text-white' : 'bg-terracotta-500 text-white hover:bg-terracotta-400'
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-cream-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-terracotta-500 text-white p-4">
            <h3 className="font-display font-semibold">Mala — Shopping Assistant</h3>
            <p className="text-sm text-terracotta-100">Ask about products, orders, or care tips</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] px-4 py-2.5 rounded-2xl text-sm',
                  msg.role === 'user'
                    ? 'bg-terracotta-500 text-white rounded-br-md'
                    : 'bg-cream-100 text-stone-800 rounded-bl-md'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cream-100 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-stone-500">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-cream-200 p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-terracotta-500 text-white rounded-xl hover:bg-terracotta-400 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
