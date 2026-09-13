import { useState } from 'react';
import { AgentMessage } from '../types';
import { apiService } from '../services/api';

export const useAgent = (projectId?: string) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Hello! I am your AegisAI Engineering Agent. Ask me questions about your analyzed project, architectural risks, or what to fix first.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !projectId) return;

    const userMsg: AgentMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await apiService.sendAgentMessage(projectId, text);
      const agentMsg: AgentMessage = {
        id: `agt_${Date.now()}`,
        sender: 'agent',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context_used: res.context_used
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      const errorMsg: AgentMessage = {
        id: `err_${Date.now()}`,
        sender: 'agent',
        text: 'Sorry, I encountered an error communicating with the backend API.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
