import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

@Component({
  selector: 'app-situation-presentation',
  templateUrl: './situation-presentation.component.html',
  styleUrls: ['./situation-presentation.component.css']
})
export class SituationPresentationComponent implements OnInit {
  public situations: any[];
  public title : string;
    public before : string;
  //
  public selectedsituation: any;
  public submitted: boolean;
  public errorMessage : string;
  public isCouple : boolean;

  constructor(
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute, private router: Router,
    private translate: TranslateService
    ) {
      this.translate.get("SituationRequired").subscribe((res:string) => {
        //console.log(res);
        this.errorMessage = res;
      });
     }

  ngOnInit() {

    this.sharedDataService.getEtapeInscription()
    .subscribe(etape => {
        if(etape <4)
        {
          this.router.navigate(['/splashcreen']);
        }
    });

    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape4")
      this.situations = etape.value;
      //console.log(inscriptionsteps.etapes);
      this.title = etape.title;
    
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
        this.before = "/inscription/orientation";
      let vousetes = etapes.find((item) => item.etape === "etape1")
      if(inscription){
          if(inscription.id_vsetes) {

              let selectedVe = vousetes.value.find((item) => item.id === inscription.id_vsetes);
              if(selectedVe && selectedVe.label && selectedVe.label.toLocaleLowerCase().indexOf("couple") !== -1)
              {
                  this.before = "/inscription/statut" ;
              }
          }
        this.selectedsituation = this.situations.find((item) => item.id === inscription.id_situation);
        //console.log( this.selectedsituation );
        if(
          inscription.id_orientation && 
          inscription.id_statut &&           
          inscription.id_vsetes){
            var allStepCompleted = true;
          }
          /*else
          {
            this.router.navigate(['/splashcreen']);
          }*/
      }
        
      });
    });
      
  }
  public onSubmit() {
    if(this.selectedsituation){
      this.sharedDataService.setEtapeInscription(5);
      this.router.navigate(['/inscription/tendance']);
    }
    else{
      this.submitted = true; 
    }
  }
  public onSelect(selectedItem: any): void {
    this.submitted = false; 
    this.selectedsituation = selectedItem;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {      
      //console.log(selectedItem);
      inscription.id_situation = selectedItem.id;
      //console.log(inscription);
    });
  }

}
