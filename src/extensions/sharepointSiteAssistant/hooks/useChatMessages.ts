import { useState, useCallback } from 'react';
import { IMessage } from '../models/IMessage';

interface IChatMessages {
  messages: IMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
}

export function useChatMessages(): IChatMessages {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = useCallback((): void => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: trimmed, isUser: true }]);
    setInputText('');
  }, [inputText]);

  return { messages, inputText, setInputText, sendMessage };
}
