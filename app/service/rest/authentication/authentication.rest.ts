import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthenticationRest {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    baseUrlApp: string;
    loginUrl: string;
    resetPasswordUrl: String;
    resetMailUrl: String;
    confirmResetPasswordUrl: String;
     baseUrlFront: string;
    idSite: string;
    constructor(private http: Http, private appConfig: AppConfig, private authHttp: AuthHttp) {
        this.loginUrl = this.appConfig.getConfig('loginUrl');
        this.idSite = this.appConfig.getSiteIdByLocation();
        this.baseUrlApp = environment.baseUrlAppUrl;
        // this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.resetPasswordUrl = this.appConfig.getConfig('resetPasswordUrl');
        this.confirmResetPasswordUrl = this.appConfig.getConfig('confirmResetPasswordUrl');
        // this.baseUrlFront = this.appConfig.getConfig("baseUrlFront");
        this.baseUrlFront = environment.baseUrlFront;
        this.resetMailUrl = this.appConfig.getConfig('resetMailUrl');

    }

//     ajout: 
// GET : /api/token 
// à appeler apres login

    sendToken(){
        const url =  this.baseUrlApp + 'api/token';
       return  this.authHttp.get(url);
    }

    completeAndLog(data){
        const loginUrl = this.baseUrlApp + 'addSexeAgeUser';
        return this.http.post(loginUrl, data);
    }


    login(email: string, password: string, ip: string): Observable<Response> {
        email = email.trim();
        const loginUrl = this.baseUrlApp  + this.idSite + this.loginUrl;
        const loginData = {  '_email' : email, '_password': password, '_ip': ip};
        return this.http.post(loginUrl, loginData);
    }

    confirmResetPassword(user: String, code: String, sentDate: String, password: String, idSite: String): Observable<Response> {

        const confirmResetPasswordUrl = this.baseUrlApp + this.confirmResetPasswordUrl;
        const idSiteData = idSite !== '' ? idSite  : this.idSite;

        const emailData = {
            'user': user,
            'idSite': + idSiteData,
            'codeConfirmation': code,
            'password': password,
            'dateSendMail': sentDate
            };
        return this.http.post(confirmResetPasswordUrl, emailData);
    }

    resetPassword(user , idSite : String): Observable<Response> {

        const resetPasswordUrl = this.baseUrlApp + this.resetPasswordUrl;

        const idSiteData = idSite !== '' ? idSite  : this.idSite;
        const lien = user.isActive?this.baseUrlFront + '/password/renderMail':this.baseUrlFront + '/inscription/renderMailConfirm';

        const emailData = {
            'user': user.user,
            'idSite': + idSiteData,
            'lien' : lien
        }
        return this.http.post(resetPasswordUrl, emailData);
    }

    resetPseudoOrMail(idUser: String , PseudoNotMail: boolean): Observable<Response> {
        const AdmRejectMailUrl = this.baseUrlApp + this.resetMailUrl;
        const userData = {
            'idUser': idUser,
            'moderatePseudoNotMail': PseudoNotMail,
            'isRejet': 1,
        }
        return this.authHttp.post(AdmRejectMailUrl, userData);
    }

    updateConnectionStatus(isConnected: String): Observable<Response> {
        const connectionStatusUrl = this.baseUrlApp + 'api/connexion/statut/update';
        const userData = {
            'statut': +isConnected
        };
        // console.log(connectionStatusUrl, ' data ', userData);
        return this.authHttp.post(connectionStatusUrl, userData);
    }

}