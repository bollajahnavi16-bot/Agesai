import React, { useState } from 'react';
import { useAgent } from '../../hooks/useAgent';
import { MessageBubble } from './MessageBubble';
import { Button } from '../common/Button';
import { Send, Sparkles } from 'lucide-react';

interface AgentChatProps {
  projectId: string;
}

const SUGGESTED_QUESTIONS = [
  "What should I fix first?",
  "Why is my health score low?",
  "Are there security risks?",
  "Explain the detected RAG architecture.",
  "What are my biggest reliability risks?"
];

export const AgentChat: React.FC<AgentChatProps> = ({ projectId }) => {
  const { messages, sendMessage, loading } = useAgent(projectId);
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;
    sendMessage(query);
    setInput('');
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[650px] overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto select-none">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">Suggest:</span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-300 text-xs text-slate-300 border border-slate-700 hover:border-indigo-500/40 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask questions about your analyzed project..."
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <Button
          onClick={() => handleSend()}
          loading={loading}
          disabled={!input.trim()}
          variant="primary"
          icon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
