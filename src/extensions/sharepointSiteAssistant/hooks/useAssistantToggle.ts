import { useState } from 'react';

interface IAssistantToggle {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useAssistantToggle(): IAssistantToggle {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
