import * as React from 'react';
import { useState, useEffect } from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import {
  BotSparkleFilled,
  ChevronDownRegular,
  MoreHorizontalRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import * as strings from 'SharepointSiteAssistantApplicationCustomizerStrings';
import { IChatPanelProps } from '../models/ISiteAssistant';
import { useChatMessages } from '../hooks/useChatMessages';
import SuggestionChip from './SuggestionChip';
import ChatInput from './ChatInput';
import styles from './ChatPanel.module.scss';

const FALLBACK_SUGGESTIONS: string[] = [
  strings.SuggestionPrompt1,
  strings.SuggestionPrompt2,
  strings.SuggestionPrompt3,
];

const ChatPanel: React.FC<IChatPanelProps> = ({ displayName, chatService, onClose }) => {
  const { messages, inputText, isLoading, setInputText, sendMessage } = useChatMessages(chatService);
  const [suggestions, setSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS);

  useEffect(() => {
    chatService.getPrompts()
      .then(prompts => { if (prompts.length > 0) setSuggestions(prompts); })
      .catch(() => { /* keep fallback */ });
  }, [chatService]);

  return (
    <Panel
      isOpen
      type={PanelType.medium}
      isBlocking={false}
      hasCloseButton={false}
      isFooterAtBottom
      onRenderHeader={() => (
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <BotSparkleFilled fontSize={18} />
          </div>
          <span className={styles.headerTitle}>{strings.ChatPanelTitle}</span>
          <div className={styles.headerActions}>
            <button className={styles.headerButton} aria-label={strings.CollapseLabel}>
              <ChevronDownRegular fontSize={16} />
            </button>
            <button className={styles.headerButton} aria-label={strings.MoreOptionsLabel}>
              <MoreHorizontalRegular fontSize={16} />
            </button>
            <button className={styles.headerButton} onClick={onClose} aria-label={strings.CloseLabel}>
              <DismissRegular fontSize={16} />
            </button>
          </div>
        </div>
      )}
      onRenderFooterContent={() => (
        <ChatInput value={inputText} onChange={setInputText} onSend={sendMessage} disabled={isLoading} />
      )}
      onDismiss={onClose}
    >
      <div className={styles.body}>
        <h2 className={styles.greeting}>{strings.ChatGreetingPrefix} {displayName}!</h2>
        <p className={styles.subtitle}>{strings.ChatGreetingSubtitle}</p>
        <div className={styles.suggestions}>
          {suggestions.map((text, i) => (
            <SuggestionChip key={i} text={text} onClick={setInputText} />
          ))}
        </div>
        {messages.length > 0 && (
          <div className={styles.messages}>
            {messages.map(msg => (
              <div key={msg.id} className={msg.isUser ? styles.userMessage : styles.assistantMessage}>
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
};

export default ChatPanel;
