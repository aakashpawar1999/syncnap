import * as en from '../locales/en.json';

export function loadMessages(): Record<string, any> {
  // You can implement logic here to load messages based on the user's language preference.
  // For now, we'll use the English (en) messages by default.
  return en;
}
