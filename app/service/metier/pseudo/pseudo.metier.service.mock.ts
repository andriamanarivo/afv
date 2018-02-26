import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import { PseudoMetierServiceACI } from '.';

import { mockpseudo } from '../../../donnee/pseudo/mock-pseudo';

@Injectable()
export class PseudoMetierServiceMock implements PseudoMetierServiceACI {

       
    public getPseudo() {
        return Observable.of(mockpseudo);
    }

}
