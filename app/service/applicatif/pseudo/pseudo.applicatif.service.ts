import { Injectable } from '@angular/core';
import { PseudoApplicatifServiceACI } from '.';
//import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import { PseudoMetierServiceACI} from '../../metier/pseudo/pseudo.metier.service.aci';
import { mockpseudo } from '../../../donnee/pseudo/mock-pseudo';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

@Injectable()
export class PseudoApplicatifService implements PseudoApplicatifServiceACI {
    authtoken : string;
    constructor(
        private http: Http,
        private pseudoMetierService : PseudoMetierServiceACI
        //private authHttp: AuthHttp
        ) {}

    public getPseudo() {
        //return this.pseudoMetierService.getPseudo();
        return Observable.of(mockpseudo);
    }
    
}
