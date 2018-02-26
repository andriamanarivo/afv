import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { InscriptionApplicatifServiceACI } from '../../service/applicatif/inscription';
import { SharedDataService } from '../../presentation/shared/service/shared-data.service';

@Injectable()
export class InscriptionResolve implements Resolve<any> {
  
  constructor(
      private sharedDataService : SharedDataService,
      private inscriptionApplicatifService : InscriptionApplicatifServiceACI
      ) {}
  
  resolve(route: ActivatedRouteSnapshot) {
      let inscription =  this.inscriptionApplicatifService.getInscription(1);
      inscription.subscribe(inscription => {
        //console.log(inscription);
      },
      err => {
          //console.log(err);
          //alert(err);
      });
    
      return inscription;
    //return this.inscriptionApplicatifService.getInscription(route.params['id']);
  }
}