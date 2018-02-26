import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { InscriptionRest} from '../../rest/inscription/inscription.rest';
import { Inscription } from '../../../donnee/inscription/inscription';

import { InscriptionMetierServiceACI } from '.';
import { UtilsService } from "../../../commun/utils.service";

@Injectable()
export class InscriptionMetierService implements InscriptionMetierServiceACI {
    public getIp() {
        return this.inscriptionRest.getIp()
        .map(this.extractData)
           .catch(this.handleError);
    }
    

    constructor(
        //private http : Http,
    private inscriptionRest: InscriptionRest,
    private utilsService: UtilsService) { }
    public verifyUserDatas(userData: any) {
        return this.inscriptionRest.verifyUserDatas(userData)
         .map(this.extractData)
            .catch(this.handleError);
    }
    public getInscription(id: number): Observable<any>  {
        return this.inscriptionRest.getInscription(id)      
            //.map(res => res)
            //.map(res => this.extractData)
            .map((res)=> {return this.extractInscriptionData(res, this)})
            .catch(this.handleError);
    }

    extractInscriptionData(res: any, me) {
        let data = res.json();       
        if (data.etapes && Array.isArray(data.etapes)) {
            data.etapes.map((e) => {
                e["title"] = me.utilsService.capitalizeFirstLetter(e["title"]);
            });
        }
        return data;
    }

    public postInscription(inscription: Inscription): Observable<any>  {        
        return this.inscriptionRest.postInscription(inscription)
            .map(this.extractDataPost)
            .catch(this.handleError);
    }

    public postConfirmInscription(pseudo : String, email:String, code : String, sentDate : String): Observable<any>  {
        //return null;
        return this.inscriptionRest.postConfirmInscription(pseudo, email, code, sentDate)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: any) {
        //console.log(res);
        let data = res.json();
        return data;
    }

    private extractDataPost(res: any) {
        //console.log(res.json());
        let data = res.json();
        return data;
    }
    private handleError(error: any) {
        return Observable.throw(error);
    }

}
