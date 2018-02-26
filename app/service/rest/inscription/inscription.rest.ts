import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { Inscription } from '../../../donnee/inscription/inscription';
import { InscriptionData } from '../../../donnee/inscription/inscriptiondata';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';
import { environment } from '../../../../environments/environment';

@Injectable()
export class InscriptionRest {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    
    baseUrlApp: string;
    stepinscriptionUrl: string;
    inscriptionUrl: string;
    confirmInscriptionUrl : string;
    baseUrlFront  : string;

    idSite: string;
    constructor(private http: Http, private appConfig : AppConfig) {
        this.stepinscriptionUrl = this.appConfig.getConfig("stepinscriptionUrl");
        this.inscriptionUrl = this.appConfig.getConfig("inscriptionUrl");
        this.idSite = this.appConfig.getSiteIdByLocation();
        //this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrlApp = environment.baseUrlAppUrl;
        this.confirmInscriptionUrl = this.appConfig.getConfig("confirmInscriptionUrl");        
        //this.baseUrlFront = this.appConfig.getConfig("baseUrlFront");
        this.baseUrlFront = environment.baseUrlFront;
    }

    public getIp() {
        return this.http.get("https://api.ipify.org/?format=json");
    }
 
    verifyUserDatas(userData: any){
        console.log(userData);
        let verifyDataIrl = environment.baseUrlAppUrl + "userAlready";
        console.log(verifyDataIrl);
        return this.http.post(verifyDataIrl, userData);
    }
    getInscription(id: number): Observable<Response> {
        //let isncriptionurl = 'http://bdm.dev.arkeup.com/1/inscription'
        //let isncriptionurl = 'http://local.bdm.loc/' + env + '/inscription';
        let stepinscriptionUrl = this.baseUrlApp  + this.idSite + this.stepinscriptionUrl;
        //this.baseUrlAppUrl + '/' + this.dataConst.Const.searchAllFamilleWsName;
        return this.http.get(stepinscriptionUrl);
    }

    postInscription(inscription: Inscription): Observable<Response> {
        let inscriptionUrl = this.baseUrlApp  + this.inscriptionUrl;
        //return this.http.post(inscriptionUrl, JSON.stringify(inscriptionData));
        let inscriptionData = new InscriptionData();
        inscription.idsite = +this.idSite;
        inscriptionData.utilisateur = inscription;
        inscriptionData.lien = this.baseUrlFront + "/inscription/renderMailConfirm"

        return this.http.post(inscriptionUrl, inscriptionData);
    }

    postConfirmInscription(pseudo : String, email:String, code : String, sentDate:String): Observable<Response> {
        
        let confirmInscriptionUrl = this.baseUrlApp + this.confirmInscriptionUrl;        
        let emailData = {
            "dateSendMail": sentDate,
            "code": code,
            "idSite": +this.idSite,
            //"email": email,
            "pseudo": pseudo
            }
        //http://bdm.dev.arkeup.com/
        return this.http.post(confirmInscriptionUrl, emailData);
    }
    
}