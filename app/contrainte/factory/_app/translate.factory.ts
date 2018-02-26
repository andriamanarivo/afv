import {
  TranslateModule,
  TranslateLoader,
  TranslateStaticLoader,
  TranslatePipe
} from 'ng2-translate';

import {
  Http,
  // HttpModule , RequestOptions
} from '@angular/http';
export function httpFactory(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

export function httpFactoryChild(http: Http) {
  // return new TranslateStaticLoader(http, '../../../assets/i18n', '.json');
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}