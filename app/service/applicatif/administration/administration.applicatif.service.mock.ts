import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import {AdministrationApplicatifServiceACI } from '.';


@Injectable()
export class AdministrationApplicatifServiceMock  {
    public getSubscribedNewsletter(){
       throw new Error("Method not implemented.");
    }

    public stopAbonnement(){
       throw new Error("Method not implemented.");
    }
    
}