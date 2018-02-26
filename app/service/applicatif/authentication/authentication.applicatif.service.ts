import { Injectable } from '@angular/core';
import { AuthenticationApplicatifServiceACI } from '.';

import { AuthenticationMetierServiceACI} from '../../metier/authentication/authentication.metier.service.aci';

import { mockRenderMail } from '../../../donnee/inscription/mock-render-mail';

import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { authenticationtoken, authenticationtokenexpired,authenticationtokenno } from '../../../donnee/authentication';


@Injectable()
export class AuthenticationApplicatifService implements AuthenticationApplicatifServiceACI {
  
    //constructor(private contactMetierServiceACI: ContactMetierServiceACI) { }
    authtoken : string;
    constructor(
      public authHttp: AuthHttp, 
      private authenticationMetierService : AuthenticationMetierServiceACI,
      public jwtHelper : JwtHelper
    ) {}

    public sendToken() {
        return  this.authenticationMetierService.sendToken();
    }

    public loggedIn() {
        var token = sessionStorage.getItem('id_token');
        if(token && token !== undefined){
            return !this.jwtHelper.isTokenExpired(token);
        }
        else
         return false;
    }
    
    public islogged() {
        var token = sessionStorage.getItem('id_token');
        if(token === undefined || token === null) {
            return undefined;
        }
        if(token && token !== undefined){
            return !this.jwtHelper.isTokenExpired(token);
        }
        else
         return false;
    }
      
    public logout() {
        this.authenticationMetierService.updateConnectionStatus('0');
      sessionStorage.removeItem('id_token');
      sessionStorage.removeItem('rfIuid');
      sessionStorage.removeItem('allUnreadMessageCount');
    }

    public parsetoken() {
      //console.log(tokenNotExpired());
      var token = sessionStorage.getItem('id_token');
      if(token)
      {
        //console.log(token);
        console.log(
          this.jwtHelper.decodeToken(token),
          this.jwtHelper.getTokenExpirationDate(token),
          this.jwtHelper.isTokenExpired(token)
        );
      }
    }

    public confirmResetPassword(user, code : String, sentDate:String, password:String, idSite:String) {
      //return Observable.of(mockRenderMail);
      return this.authenticationMetierService.confirmResetPassword(user, code, sentDate, password,idSite);
    }

    public resetPassword(user:String , idSite : String) {
      
      return this.authenticationMetierService.resetPassword(user, idSite);
    }
    public login(email: string, password: string, ip:string) {
      return this.authenticationMetierService.login(email,password, ip);
    }
    public completeAndLog(data){
        return this.authenticationMetierService.completeAndLog(data);
    }

    private handleError(error) {
        return Observable.throw(error);
    }

    private extractData(res) {
        return res;
    }

    public resetPseudoOrMail(idUser:String , ismail: boolean){
        return this.authenticationMetierService.resetPseudoOrMail(idUser, ismail);
    }

    public updateConnectionStatus(isConnected: String) {
        return this.authenticationMetierService.updateConnectionStatus(isConnected);
    }

    
}
