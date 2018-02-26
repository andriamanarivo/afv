import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { AuthenticationRest} from '../../rest/authentication/authentication.rest';
import { authenticationtoken, authenticationtokenexpired, authenticationtokenno } from '../../../donnee/authentication';

import { AuthenticationMetierServiceACI } from '.';

@Injectable()
export class AuthenticationMetierService implements AuthenticationMetierServiceACI {
 

    constructor(
    private authenticationRest: AuthenticationRest) { }
    completeAndLog(data){
        return this.authenticationRest.completeAndLog(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public sendToken() {
        return this.authenticationRest.sendToken()
        .map(this.extractData)
        .catch(this.handleError);
    }

    public login(email: string, password: string, ip: string): Observable<any>  {
        /*
        return Observable.of(authenticationtoken)
        .map(this.extractData)
            .catch(this.handleError);
            */

        return this.authenticationRest.login(email, password, ip)
            .map(this.extractData)
            .catch(this.handleError);

    }

    public confirmResetPassword(user, code : String, sentDate: String, password: String, idSite: String): Observable<any>  {

        return this.authenticationRest.confirmResetPassword(user, code, sentDate, password, idSite)
            .map(this.extractData)
            .catch(this.handleError);

    }

    public resetPassword( user: String , idSite : String): Observable<any>  {

        return this.authenticationRest.resetPassword(user , idSite)
            .map(this.extractData)
            .catch(this.handleError);

    }

    private extractData(res: any) {
        // console.log(res);
        const data = res.json();
        return data;
    }
    private handleError(error: any) {
        return Observable.throw(error.json());
    }

    public resetPseudoOrMail(idUser: String , PseudoNotMail: boolean) {
         return this.authenticationRest.resetPseudoOrMail(idUser , PseudoNotMail)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public updateConnectionStatus(isConnected: String) {
        return this.authenticationRest.updateConnectionStatus(isConnected)
           .map(this.extractData)
           .catch(this.handleError);
   }
}
