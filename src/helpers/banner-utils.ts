/**
 * Provides field-level validation error collection, formatting, and shared banner rendering.
 */

import { html, nothing } from 'lit';

export interface Banner {
  messages: string[];
  variant: string;
}

/**
 * Fetches field-level validation errors from PCore's MessageManager for the
 * given `itemKey` (assignment work item key), formats them into banner objects.
 *
 * @param itemKey - The assignment work item key (e.g. "context/containerName")
 * @returns Banner[] — array of banner objects (empty when no validation errors)
 */
export function getValidationBanners(itemKey: string): Banner[] {
  const localizedValue = PCore.getLocaleUtils().getLocaleValue;
  const validationErrors: any[] = PCore.getMessageManager().getValidationErrorMessages(itemKey) || [];

  const formattedErrors: string[] = validationErrors.map((error: any) => {
    let message = '';

    if (typeof error === 'string') {
      message = error;
    } else {
      error.label = error.label.endsWith(':') ? error.label : `${error.label}:`;
      message = `${error.label} ${error.description}`;
    }

    return localizedValue(message, 'Messages');
  });

  return formattedErrors.length > 0 ? [{ messages: formattedErrors, variant: 'urgent' }] : [];
}

/**
 * Caller should assign the result to their banners property.
 *
 * @returns Banner[] — always an empty array
 */
export function clearValidationBanners(): Banner[] {
  return [];
}

/**
 * Renders an array of Banner objects into lit-html templates.
 *
 * @param banners - Array of Banner objects to render
 * @returns lit-html template or `nothing` if no banners have messages
 */
export function renderBanners(banners: Banner[]) {
  if (!banners || banners.length === 0) {
    return nothing;
  }

  return banners.map(banner => {
    if (!banner.messages || banner.messages.length === 0) {
      return nothing;
    }

    return html`
      <div class="psdk-alert psdk-alert-${banner.variant}">
        ${banner.messages.map(
          (msg: string) => html`
            <div class="psdk-alert-message">
              <span class="psdk-alert-icon">!</span>
              <span>${msg}</span>
            </div>
          `
        )}
      </div>
    `;
  });
}

/** PubSub event name for clearing banners across components. */
export const CLEAR_BANNER_MESSAGES_EVENT = 'clearBannerMessages';
