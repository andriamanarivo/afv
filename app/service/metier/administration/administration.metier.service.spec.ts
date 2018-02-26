/*import {async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { APP_INITIALIZER } from '@angular/core';
import { Http, HttpModule,BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection  } from '@angular/http/testing';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';
import {AdministrationMetierService} from './administration.metier.service';
import { AdministrationRest} from '../../rest/administration/administration.rest';

export function appConfigServiceFactory(config : AppConfig) {
  return () => config.load();
}

export function authHttpServiceFactory(http: Http, options: RequestOptions, appConfig:AppConfig) {
    return new AuthHttp(new AuthConfig({
     headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => sessionStorage.getItem('id_token')),
	}), http, options);
}

describe('administrationMetierServiceTest', () => {

    let mockBackend: MockBackend;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                AdministrationMetierService,
                AdministrationRest,
                AppConfig,
                MockBackend,
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
            
                {
                provide: AuthHttp,
                useFactory: authHttpServiceFactory,
                deps: [Http, RequestOptions]
                }
            ],
            imports: [
                HttpModule
            ]
        });
        mockBackend = getTestBed().get(MockBackend);

    }));

    it('should login', async(() => {
        AdministrationMetierService
        mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                new ResponseOptions({
                    body: [
                        {
                            statut: 200
                        }]
                    }
            )));
        });
        
    }));
    
});*/

