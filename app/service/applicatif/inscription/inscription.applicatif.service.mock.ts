import { Injectable } from '@angular/core';
import { InscriptionApplicatifServiceACI } from '.';

import {Observable} from "rxjs/Observable";
import { inscriptionstep } from '../../../donnee/inscription/mock-process-inscription';
import { Inscription } from '../../../donnee/inscription/inscription';

import { mockinscription } from '../../../donnee/inscription/mock-inscription';
import { mockRenderMail } from '../../../donnee/inscription/mock-render-mail';
import { InscriptionMetierServiceACI} from '../../metier/inscription/inscription.metier.service.aci';

declare var Auth0Lock: any;

@Injectable()
export class InscriptionApplicatifServiceMock implements InscriptionApplicatifServiceACI {
    public getIp() {
        throw new Error("Method not implemented.");
    }
    public verifyUserDatas(userData: any) {
        throw new Error("Method not implemented.");
    }

    constructor( private inscriptionMetierService : InscriptionMetierServiceACI) {}
    
    public getInscription(id: number) {
      //return Observable.of(inscriptionstep);
      return this.inscriptionMetierService.getInscription(id);
    }

    public postInscription(inscription: Inscription): Observable<any>  {
        //return Observable.of(mockinscription);
        return this.inscriptionMetierService.postInscription(inscription);
    }

    public postConfirmInscription(pseudo : String, email:String, code : String, sentDate:String): Observable<any>  {
        return Observable.of(mockRenderMail);
    }
    
}
