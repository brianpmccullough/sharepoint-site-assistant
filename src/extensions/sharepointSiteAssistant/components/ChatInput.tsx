import * as React from 'react';
import { AddRegular, MicRegular, SendFilled } from '@fluentui/react-icons';
import * as strings from 'SharepointSiteAssistantApplicationCustomizerStrings';
import { IChatInputProps } from '../models/ISiteAssistant';
import styles from './ChatInput.module.scss';

const ChatInput: React.FC<IChatInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.iconButton} aria-label={strings.AttachLabel}>
        <AddRegular fontSize={20} />
      </button>
      <input
        className={styles.input}
        type="text"
        placeholder={strings.ChatInputPlaceholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={strings.ChatInputPlaceholder}
      />
      <button className={styles.iconButton} aria-label={strings.MicrophoneLabel}>
        <MicRegular fontSize={20} />
      </button>
      <button className={styles.sendButton} onClick={onSend} aria-label={strings.SendMessageLabel}>
        <SendFilled fontSize={16} />
      </button>
    </div>
  );
};

export default ChatInput;
