import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SiteAssistant from './components/SiteAssistant';
import { ChatService } from './services/ChatService';
import { IChatService } from './models/IChatService';

const LOG_SOURCE: string = 'SharepointSiteAssistantApplicationCustomizer';

export interface ISharepointSiteAssistantApplicationCustomizerProperties {
  apiUrl: string;
}

export default class SharepointSiteAssistantApplicationCustomizer
  extends BaseApplicationCustomizer<ISharepointSiteAssistantApplicationCustomizerProperties> {

  private _chatService!: IChatService;

  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized');
    const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
    const siteAbsoluteUrl = this.context.pageContext.site.absoluteUrl;
    this._chatService = new ChatService(this.properties.apiUrl, siteAbsoluteUrl, tokenProvider);
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholder);
    this._renderPlaceholder();
  }

  private _renderPlaceholder(): void {
    const placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (!placeholder) {
      Log.warn(LOG_SOURCE, 'Bottom placeholder not available');
      return;
    }
    const displayName = this.context.pageContext.user.displayName;
    ReactDOM.render(
      React.createElement(SiteAssistant, { displayName, chatService: this._chatService }),
      placeholder.domElement
    );
  }

  protected onDispose(): void {
    const placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (placeholder) {
      ReactDOM.unmountComponentAtNode(placeholder.domElement);
    }
  }
}
