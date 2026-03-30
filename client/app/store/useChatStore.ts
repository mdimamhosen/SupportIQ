import { create } from 'zustand';
import { api } from '../api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ChatContext {
  id: number;
  summary: string;
  createdAt: string;
}

interface ChatState {
  chatContexts: ChatContext[];
  currentContextId: number | null;
  messages: Message[];
  isLoading: boolean;
  
  setContext: (id: number | null) => void;
  startNewChat: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  fetchContexts: () => Promise<void>;
  fetchMessages: (contextId?: number) => Promise<void>;
  refineMessage: (content: string) => Promise<string>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatContexts: [],
  currentContextId: null,
  messages: [],
  isLoading: false,

  setContext: (id) => {
    set({ currentContextId: id });
    if (id) {
      get().fetchMessages(id);
    } else {
      set({ messages: [] });
    }
  },

  startNewChat: () => {
    set({ currentContextId: null, messages: [] });
  },

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  fetchContexts: async () => {
    try {
      const data = await api<ChatContext[]>('/chat/contexts');
      set({ chatContexts: data });
      
      if (!get().currentContextId && data.length > 0) {
        get().setContext(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch contexts:', error);
    }
  },

  fetchMessages: async (contextId) => {
    const id = contextId || get().currentContextId;
    if (!id) return;
    
    try {
      const data = await api<any[]>(`/chat/context/${id}/messages`);
      const messages: Message[] = [];
      
      data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      data.forEach((conv) => {
        messages.push({
          id: `msg-${conv.id}-u`,
          role: 'user',
          content: conv.message,
          timestamp: new Date(conv.createdAt),
        });
        messages.push({
          id: `msg-${conv.id}-a`,
          role: 'assistant',
          content: conv.response,
          timestamp: new Date(conv.createdAt),
          sentiment: conv.sentiment,
        });
      });

      set({ messages });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return;
    
    get().addMessage({ role: 'user', content });
    set({ isLoading: true });
    
    try {
      const result = await api<any>('/chat', {
        method: 'POST',
        body: { 
          message: content,
          contextId: get().currentContextId || undefined
        },
      });
      
      if (!get().currentContextId && result.chatContext) {
        set({ currentContextId: result.chatContext.id });
        get().fetchContexts();
      }
      
      get().addMessage({
        role: 'assistant',
        content: result.response,
        sentiment: result.sentiment,
      });
    } catch (error: any) {
      console.error('Chat API Error:', error);
      get().addMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Please try again later.'}`,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  editMessage: async (messageId: string, newContent: string) => {
    if (!newContent.trim()) return;
    
    const messages = get().messages;
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const updatedMessages = messages.slice(0, msgIndex);
    set({ messages: updatedMessages });
    
    await get().sendMessage(newContent);
  },

  regenerateResponse: async (messageId: string) => {
    const messages = get().messages;
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const userMsg = messages[messageId.includes('-a') ? msgIndex - 1 : msgIndex];
    if (!userMsg || userMsg.role !== 'user') return;

    const updatedMessages = messages.slice(0, msgIndex);
    set({ messages: updatedMessages });
    
    await get().sendMessage(userMsg.content);
  },

  deleteMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.filter(m => m.id !== messageId)
    }));
  },
  
  refineMessage: async (content: string) => {
    if (!content.trim()) return content;
    try {
      const response = await api<{ refinedText: string }>('/chat/refine', {
        method: 'POST',
        body: { text: content },
      });
      return response.refinedText;
    } catch (error) {
      console.error('Failed to refine message:', error);
      return content;
    }
  },
}));
