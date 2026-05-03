import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Sparkles, RotateCcw, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const INITIAL = [
  { role: 'ai', text: "Hi! I'm **NeuralAI**, your intelligent learning assistant. I can help you with:\n\n• Understanding course concepts\n• Suggesting your next learning steps\n• Answering programming questions\n• Analyzing your progress\n\nWhat would you like to explore today?" }
];

const QUICK_PROMPTS = [
  'Explain gradient descent simply',
  'What should I learn next?',
  'My progress summary',
  'Best Python resources',
  'How do neural networks work?',
  'Debug my React code',
];

const AI_RESPONSES = [
  "Great question! Gradient descent is like finding the lowest point in a hilly landscape by always stepping downhill. In ML, we're minimizing a **loss function** — think of each parameter as a coordinate, and gradient descent tells us which direction to move to reduce the error.\n\n```python\n# Simple gradient descent\nfor epoch in range(100):\n    prediction = model(X)\n    loss = criterion(prediction, y)\n    loss.backward()  # compute gradients\n    optimizer.step() # update params\n```\n\nWant me to dive deeper into learning rates or momentum?",
  "Based on your current ML course progress (68%), I'd suggest:\n\n1. **Complete Neural Networks module** — You're 3 lessons away\n2. **Start Backpropagation** — Critical foundation\n3. **Practice on Kaggle** — Apply what you've learned\n\nAfter that, PyTorch would be a natural next step. Your pace suggests you'll finish in ~2 weeks at current speed 🚀",
  "Here are your stats:\n\n📚 **3 courses enrolled**\n⏱️ **124 hours learned**\n✅ **68% average progress**\n🔥 **14-day streak**\n\nYou're in the **top 5%** of learners this week! The ML course needs the most attention. Want a personalized study plan?",
  "For Python resources, I recommend:\n\n**Free:**\n• Python.org docs — official reference\n• Automate the Boring Stuff — practical projects\n• Real Python — tutorials for all levels\n\n**Practice:**\n• LeetCode for algorithms\n• HackerRank Python track\n• Kaggle notebooks for data science\n\nWhat aspect of Python are you focusing on?",
  "Neural networks are inspired by the brain! Here's the core idea:\n\n```\nInput → [Hidden Layers] → Output\n  ↓           ↓              ↓\nFeatures   Patterns     Prediction\n```\n\nEach **neuron** applies a weight + activation function. Stacking many neurons creates complex representations. The magic is in **backpropagation** — errors flow backward to update all weights simultaneously.\n\nShould I explain activation functions or show you a code example?",
];

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-white/[0.06] rounded-xl p-3 my-2 text-xs overflow-x-auto font-mono leading-relaxed">$2</pre>')
    .replace(/\n/g, '<br/>');
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(() => Date.now());
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
  const { user }                = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);

    // Simulate AI response (replace with real API call)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const reply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    setMessages(p => [...p, { role: 'ai', text: reply }]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const copyMsg = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('') || 'U';

  return (
    <div className="flex flex-col h-[calc(100vh-64px-48px)] -m-6 overflow-hidden">
      <div className="flex flex-col h-full mx-6 mt-6 card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-lg animate-glow-pulse">🧠</div>
          <div>
            <div className="font-head font-bold text-sm">NeuralAI Assistant</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-xs text-white/40">Online · Powered by Claude</span>
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            {[Sparkles, RotateCcw].map((Icon, i) => (
              <button key={i} className="btn btn-ghost btn-sm btn-icon" title={i === 0 ? 'Suggestions' : 'Clear chat'} onClick={() => i === 1 && setMessages(INITIAL)}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {m.role === 'ai' ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🧠</div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">{initials}</div>
              )}
              <div className={`group max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'ai'
                      ? 'bg-gradient-to-br from-accent/10 to-accent2/5 border border-accent/15 rounded-tl-sm'
                      : 'bg-white/[0.07] border border-white/[0.12] rounded-tr-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }}
                />
                {m.role === 'ai' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyMsg(m.text)} className="btn btn-ghost btn-sm btn-icon p-1"><Copy size={11} /></button>
                    <button className="btn btn-ghost btn-sm btn-icon p-1"><ThumbsUp size={11} /></button>
                    <button className="btn btn-ghost btn-sm btn-icon p-1"><ThumbsDown size={11} /></button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm flex-shrink-0">🧠</div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-accent/10 to-accent2/5 border border-accent/15">
                <div className="flex gap-1 items-center h-5">
                  {[0,1,2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-accent"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-5 py-2.5 flex gap-2 overflow-x-auto border-t border-white/[0.04] flex-shrink-0">
          {QUICK_PROMPTS.map(q => (
            <button key={q} onClick={() => send(q)} className="btn btn-ghost btn-sm flex-shrink-0 text-xs">{q}</button>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pb-5 pt-2 flex gap-3 flex-shrink-0">
          <div className="flex-1 flex items-center gap-3 bg-white/[0.04] border border-white/[0.12] rounded-2xl px-4 focus-within:border-accent focus-within:bg-white/[0.07] transition-all">
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/20 py-3"
              placeholder="Ask anything about your learning journey..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
          </div>
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn btn-primary px-4 rounded-2xl disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
