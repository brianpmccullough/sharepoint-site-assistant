import { useState, useCallback } from 'react';
import * as strings from 'SharepointSiteAssistantApplicationCustomizerStrings';
import { IMessage } from '../models/IMessage';
import { IChatService } from '../models/IChatService';

interface IChatMessages {
  messages: IMessage[];
  inputText: string;
  isLoading: boolean;
  setInputText: (text: string) => void;
  sendMessage: () => void;
}

export function useChatMessages(chatService: IChatService): IChatMessages {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback((): void => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: trimmed, isUser: true }]);
    setInputText('');
    setIsLoading(true);

    chatService.sendMessage(trimmed)
      .then(reply => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: reply, isUser: false }]);
        setIsLoading(false);
      })
      .catch(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: strings.ChatErrorMessage, isUser: false }]);
        setIsLoading(false);
      });
  }, [inputText, isLoading, chatService]);

  return { messages, inputText, isLoading, setInputText, sendMessage };
}
