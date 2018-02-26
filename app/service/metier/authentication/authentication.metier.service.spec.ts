/*
import { async, getTestBed , TestBed,inject } from '@angular/core/testing';
import { 
    Headers, BaseRequestOptions, RequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod
 } from '@angular/http';

 import { MockBackend , MockConnection } from '@angular/http/testing';

 import { AuthenticationMetierServiceACI,AuthenticationMetierService,AuthenticationMetierServiceMockProvider } from '.';

 import { authenticationtoken } from '../../../donnee/authentication';
 import { AuthenticationRest } from '../../../service/rest/authentication/authentication.rest';

 import { APP_INITIALIZER } from '@angular/core';
import { AppConfig }       from '../../../contrainte/config/_app/app.config';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';


 export function appConfigServiceFactory(config : AppConfig) {
  return () => config.load();
}

function getSiteByLocation(appConfig:AppConfig){
  let envLocation = window.location.hostname;
  //return 1;
  
  switch (envLocation) {
      case appConfig.getConfig("site1.sitename"):
          return appConfig.getConfig("site1.Id")
        case appConfig.getConfig("site2.sitename"):
          return appConfig.getConfig("site2.Id");
        case appConfig.getConfig("site3.sitename"):
          return appConfig.getConfig("site3.Id");
      default:
          return appConfig.getConfig("site4.Id")
  }
}
export function authHttpServiceFactory(http: Http, options: RequestOptions, appConfig:AppConfig) {
  
  let env = getSiteByLocation(appConfig);
  console.log("env",env);

  
  
    //console.log(idtoken);
    return new AuthHttp(new AuthConfig({
     headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => sessionStorage.getItem('id_token')),
	}), http, options);

  
  

}

 describe('AuthenticationMetierService', () => {
    let mockBackend: MockBackend;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationMetierService,
                AuthenticationRest,
                MockBackend,
                AppConfig,
                { 
                provide: APP_INITIALIZER, 
                useFactory: appConfigServiceFactory ,
                deps: [AppConfig], multi: true 
                },
                BaseRequestOptions,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                AuthHttp,
                JwtHelper,  
                {
                provide: AuthHttp,
                useFactory: authHttpServiceFactory,
                deps: [Http, RequestOptions,AppConfig]
                }
            ],
            imports: [
                HttpModule
            ]
        });
        mockBackend = getTestBed().get(MockBackend);

    }));

    it('should login', async(() => {
        let authenticationMetierService: AuthenticationMetierService = getTestBed().get(AuthenticationMetierService);
        console.log(authenticationtoken);
        mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                new ResponseOptions({
                    body: [
                        {
                            id: 12,
                            name: 'Narco'
                        }]
                    }
            )));
        });
        let email : string = "k.rianjafimamonjisoa@etechconsulting-mg.com";
        let password : string = "mumie";
        authenticationMetierService.login(email,password).subscribe(
                (data) => {
                    console.log(data);
                    // expect(data.length).toEqual(1);
                    // expect(data[0].id).toEqual(12);
                    // expect(data[0].name).toEqual('Narco');
                    
                }
            );
        
    }));
 });
*/