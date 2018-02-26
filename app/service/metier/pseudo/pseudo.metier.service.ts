import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { PseudoRest} from '../../rest/pseudo/pseudo.rest';

import { PseudoMetierServiceACI } from '.';

@Injectable()
export class PseudoMetierService implements PseudoMetierServiceACI {

    constructor(
        //private http : Http,
    private pseudoRest: PseudoRest) { }
    public getPseudo(): Observable<any>  {
        return this.pseudoRest.getPseudo()      
            //.map(res => res)
            //.map(res => this.extractData)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: any) {
        let data = res.json();
        return data;
    }

    private handleError(error: any) {
        return Observable.throw(error);
    }

}
