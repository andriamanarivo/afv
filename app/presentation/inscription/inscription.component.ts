import { Component, OnInit 
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { inscriptionstep } from '../../donnee/inscription/mock-process-inscription';
import { Inscription } from '../../donnee/inscription/inscription';

import { InscriptionApplicatifServiceACI,InscriptionApplicatifServiceProvider } from '../../service/applicatif/inscription';

import { SharedDataService } from '../../presentation/shared/service/shared-data.service';



@Component({
  selector: 'app-inscription',  
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']/*,
  providers:[InscriptionApplicatifServiceProvider]*/
})
export class InscriptionComponent implements OnInit {

//public countries = [ "Albania","Andorra","Armenia","Austria"];

  //public inscriptionsteps : any;
  constructor(private router:Router,
  private sharedDataService : SharedDataService,
  //private inscriptionApplicatifService : InscriptionApplicatifService,
  private route: ActivatedRoute
  
  ) { }

  ngOnInit() {
    //console.log('init inscription');
    let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
    //this.sharedDataService.sendEtapeInscription(1);
    this.sharedDataService.setinscriptionsteps(inscriptionsteps);
  }
  
}
