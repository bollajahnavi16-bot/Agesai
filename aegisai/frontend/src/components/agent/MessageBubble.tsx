import React from 'react';
import { AgentMessage } from '../../types';
import { Bot, User, Layers } from 'lucide-react';

interface MessageBubbleProps {
  message: AgentMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAgent = message.sender === 'agent';

  return (
    <div className={`flex gap-3 my-4 ${isAgent ? 'justify-start' : 'justify-end'}`}>
      {isAgent && (
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-2xl rounded-2xl p-4 ${
        isAgent
          ? 'bg-slate-900 border border-slate-800 text-slate-100'
          : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
      }`}>
        <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-75 font-mono">
          <span className="font-semibold">{isAgent ? 'AegisAI Agent' : 'Developer'}</span>
          <span>{message.timestamp}</span>
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {message.text}
        </div>

        {message.context_used && message.context_used.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Context Used: {message.context_used.join(', ')}</span>
          </div>
        )}
      </div>

      {!isAgent && (
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
