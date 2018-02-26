import { Injectable } from '@angular/core';
import { AuthenticationApplicatifServiceACI } from '.';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

import { authenticationtoken } from '../../../donnee/authentication/mock-authentication';
//import { faketoken } from './mock-token.applicatif';
import {Observable} from "rxjs/Observable";

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationApplicatifServiceMock implements AuthenticationApplicatifServiceACI {
    public sendToken() {
        throw new Error("Method not implemented.");
    }

    constructor( public jwtHelper : JwtHelper) {}

    public completeAndLog(data){
        return null;
    }
    public login(email: string, password: string, ip: string) {
        sessionStorage.setItem('id_token', authenticationtoken.token)
        //console.log(authenticationtoken.token);
    }

    public confirmResetPassword(user, code : String, sentDate: String, password: String, idSite: String) {
      return null;
    }

    public resetPassword(user: String , idSite : String) {     
      return null;
    }

    public parsetoken() {
      console.log(tokenNotExpired());
      var token = sessionStorage.getItem('id_token');
      if (token)
      {
        
        console.log(
          this.jwtHelper.decodeToken(token),
          this.jwtHelper.getTokenExpirationDate(token),
          this.jwtHelper.isTokenExpired(token)
        );
      }
    }
    public loggedIn() {
      return true;
      /* const token = sessionStorage.getItem('id_token');
        if (token && token !== undefined) {
            return true;
        } else {
          return false;
        } */
    }

    public logout() {
      sessionStorage.removeItem('id_token');
      sessionStorage.removeItem('rfIuid');
      sessionStorage.removeItem('allUnreadMessageCount');
    }

    public resetPseudoOrMail(idUser: String , ismail: boolean) {
        return null;
    }

    public updateConnectionStatus(isConnected: String) {
      return null;
  }
    /*
    private getTranslation(email: string, password: string): Observable<any> {
        return Observable.of(faketoken);
    }*/
}
