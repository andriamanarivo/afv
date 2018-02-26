import { Injectable } from '@angular/core';
import { PseudoApplicatifServiceACI } from '.';

import {Observable} from "rxjs/Observable";
import { mockpseudo } from '../../../donnee/pseudo/mock-pseudo';

declare var Auth0Lock: any;

@Injectable()
export class PseudoApplicatifServiceMock implements PseudoApplicatifServiceACI {

    constructor( ) {}
    
    public getPseudo() {
        return Observable.of(mockpseudo);
    }
    
}
