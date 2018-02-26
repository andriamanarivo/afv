import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 
import { MockBackend , MockConnection } from '@angular/http/testing';

import { 
    Headers, BaseRequestOptions, RequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod
 } from '@angular/http';

import {AuthenticationMetierServiceACI } from '.';

@Injectable()
export class AuthenticationMetierServiceMock implements AuthenticationMetierServiceACI {
    public sendToken() {
        throw new Error("Method not implemented.");
    }

    constructor(
        private mockBackend: MockBackend
    ) { }
    public completeAndLog(data){
        return null;
    }

    public login(email: string, password: string, ip: string) {
        this.mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                    new ResponseOptions({
                        body: [
                        {
                            id: 12,
                            name: 'Narco'
                        }]
                    })
                ))
            }
        );
        return null;
    }
    public confirmResetPassword(user, code: String, sentDate: String, password: String, idSite: String) {
        return null;
    }

     public resetPassword( user: String , idSite: String) {
        return null;
    }

    public resetPseudoOrMail(idUser: String , PseudoNotMail: boolean) {
         return null;
    }
    public updateConnectionStatus(isConnected: String) {
        return null;
   }
}
