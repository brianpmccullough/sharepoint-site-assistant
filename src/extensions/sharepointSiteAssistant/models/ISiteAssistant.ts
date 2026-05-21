export interface ISiteAssistantProps {
  displayName: string;
}

export interface IAssistantButtonProps {
  onClick: () => void;
}

export interface IChatPanelProps {
  displayName: string;
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
}
