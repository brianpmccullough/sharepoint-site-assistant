import * as React from 'react';
import { ISuggestionChipProps } from '../models/ISiteAssistant';
import styles from './SuggestionChip.module.scss';

const SuggestionChip: React.FC<ISuggestionChipProps> = ({ text, onClick }) => (
  <button className={styles.chip} onClick={() => onClick(text)}>
    {text}
  </button>
);

export default SuggestionChip;
