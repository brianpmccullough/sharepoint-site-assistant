import * as React from 'react';
import { BotSparkleFilled } from '@fluentui/react-icons';
import * as strings from 'SharepointSiteAssistantApplicationCustomizerStrings';
import { IAssistantButtonProps } from '../models/ISiteAssistant';
import styles from './AssistantButton.module.scss';

const AssistantButton: React.FC<IAssistantButtonProps> = ({ onClick }) => (
  <button className={styles.button} onClick={onClick} aria-label={strings.OpenAssistantLabel}>
    <BotSparkleFilled className={styles.icon} />
  </button>
);

export default AssistantButton;
