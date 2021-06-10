import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class WordMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    const {
      key,
      translateService: {
        store: { currentLang }
      }
    } = params;
    if (currentLang === 'key') {
      return key;
    }

    return 'Translation is missing!';
  }
}
