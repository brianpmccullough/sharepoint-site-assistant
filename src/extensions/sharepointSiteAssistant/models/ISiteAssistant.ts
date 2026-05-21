import { IChatService } from './IChatService';

export interface ISiteAssistantProps {
  displayName: string;
  chatService: IChatService;
}

export interface IAssistantButtonProps {
  onClick: () => void;
}

export interface IChatPanelProps {
  displayName: string;
  chatService: IChatService;
  onClose: () => void;
}

export interface ISuggestionChipProps {
  text: string;
  onClick: (text: string) => void;
}

export interface IChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}
