export interface IChatService {
  sendMessage(message: string): Promise<string>;
  getPrompts(): Promise<string[]>;
}
