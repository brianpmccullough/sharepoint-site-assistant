import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SiteAssistant from './components/SiteAssistant';

const LOG_SOURCE: string = 'SharepointSiteAssistantApplicationCustomizer';

export interface ISharepointSiteAssistantApplicationCustomizerProperties {
}

export default class SharepointSiteAssistantApplicationCustomizer
  extends BaseApplicationCustomizer<ISharepointSiteAssistantApplicationCustomizerProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized');
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholder);
    this._renderPlaceholder();
    return Promise.resolve();
  }

  private _renderPlaceholder(): void {
    const placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (!placeholder) {
      Log.warn(LOG_SOURCE, 'Bottom placeholder not available');
      return;
    }
    const displayName = this.context.pageContext.user.displayName;
    ReactDOM.render(React.createElement(SiteAssistant, { displayName }), placeholder.domElement);
  }

  protected onDispose(): void {
    const placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (placeholder) {
      ReactDOM.unmountComponentAtNode(placeholder.domElement);
    }
  }
}
