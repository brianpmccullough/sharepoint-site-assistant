import { AadTokenProvider } from '@microsoft/sp-http';
import { IChatService } from '../models/IChatService';

const AAD_CLIENT_ID = 'e2948d28-409f-47ac-961f-a288ce2418c6';

export class ChatService implements IChatService {
  private readonly _chatUrl: string;
  private readonly _promptsUrl: string;
  private readonly _tokenProvider: AadTokenProvider;

  constructor(baseUrl: string, siteAbsoluteUrl: string, tokenProvider: AadTokenProvider) {
    const parsed = new URL(siteAbsoluteUrl);
    const siteSegment = `${parsed.hostname}:${parsed.pathname}:`;
    this._chatUrl = `${baseUrl}/sites/${siteSegment}/assistant/chat`;
    this._promptsUrl = `${baseUrl}/sites/${siteSegment}/assistant/prompts`;
    this._tokenProvider = tokenProvider;
  }

  private async _authHeaders(): Promise<Record<string, string>> {
    const token = await this._tokenProvider.getToken(AAD_CLIENT_ID);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  public async sendMessage(message: string): Promise<string> {
    const headers = await this._authHeaders();
    const response = await fetch(this._chatUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.reply as string;
  }

  public async getPrompts(): Promise<string[]> {
    const headers = await this._authHeaders();
    const response = await fetch(this._promptsUrl, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json() as Promise<string[]>;
  }
}
