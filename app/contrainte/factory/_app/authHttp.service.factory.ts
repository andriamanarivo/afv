import {
    Http,
    HttpModule , RequestOptions
  } from '@angular/http';
  import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';

import { AppConfig } from '../../config/_app/app.config';



export function authHttpServiceFactory(http: Http, options: RequestOptions, appConfig: AppConfig) {

    const env = getSiteByLocation(appConfig);
    // console.log("env",env);

    // ne pas supprimer
    // utiisation future


    // if (options) {
    //    if(!options.headers.has('idSite')){
    //        options.headers.append('idSite', env);
    //    }
    // }
      return new AuthHttp(new AuthConfig({
       headerPrefix: 'Bearer',
      noJwtError: true,
      globalHeaders: [{'Accept': 'application/json'}],
      tokenGetter: (() => sessionStorage.getItem('id_token')),
      }), http, options);




  }


  function getSiteByLocation(appConfig: AppConfig) {
    const envLocation = window.location.hostname;

    switch (envLocation) {
        case appConfig.getConfig('site1.sitename'):
            return appConfig.getConfig('site1.Id');
          case appConfig.getConfig('site2.sitename'):
            return appConfig.getConfig('site2.Id');
          case appConfig.getConfig('site3.sitename'):
            return appConfig.getConfig('site3.Id');
        default:
            return appConfig.getConfig('site4.Id');
    }
  }
