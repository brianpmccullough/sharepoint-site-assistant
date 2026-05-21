import * as React from 'react';
import { ISiteAssistantProps } from '../models/ISiteAssistant';
import { useAssistantToggle } from '../hooks/useAssistantToggle';
import AssistantButton from './AssistantButton';
import ChatPanel from './ChatPanel';

const SiteAssistant: React.FC<ISiteAssistantProps> = ({ displayName }) => {
  const { isOpen, open, close } = useAssistantToggle();

  return (
    <>
      {!isOpen && <AssistantButton onClick={open} />}
      {isOpen && <ChatPanel displayName={displayName} onClose={close} />}
    </>
  );
};

export default SiteAssistant;
