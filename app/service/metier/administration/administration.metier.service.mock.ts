import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdministrationMetierServiceMock  {

    public getSubscribedNewsletter(){
        return null;
    }

    public stopAbonnement(id){
        return null;
    }

}