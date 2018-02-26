import { Injectable } from '@angular/core';
import { InscriptionApplicatifServiceACI } from '.';
//import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import { InscriptionMetierServiceACI} from '../../metier/inscription/inscription.metier.service.aci';
import { inscriptionstep } from '../../../donnee/inscription/mock-process-inscription';

import { mockConfirmInscription } from '../../../donnee/inscription/mock-confirm-inscription';
//
import { mockRenderMail } from '../../../donnee/inscription/mock-render-mail';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { Inscription } from '../../../donnee/inscription/inscription';

@Injectable()
export class InscriptionApplicatifService implements InscriptionApplicatifServiceACI {
    public getIp() {
        return this.inscriptionMetierService.getIp();
    }
    
    authtoken: string;
    constructor(
        private http: Http,
        private inscriptionMetierService : InscriptionMetierServiceACI
        //private authHttp: AuthHttp
        ) {}

    public verifyUserDatas(userData: any) {
        return this.inscriptionMetierService.verifyUserDatas(userData);
    }

    public getInscription(id: number) {
        return this.inscriptionMetierService.getInscription(id);
        //return Observable.of(inscriptionstep);
    }

    public postInscription(inscription: Inscription): Observable<any>  {       
        return this.inscriptionMetierService.postInscription(inscription);
    }

    public postConfirmInscription(pseudo : String, email:String, code : String, sentDate:String): Observable<any>  {
        //return Observable.of(mockRenderMail);
        return this.inscriptionMetierService.postConfirmInscription(pseudo, email, code, sentDate);
    }
    
}
