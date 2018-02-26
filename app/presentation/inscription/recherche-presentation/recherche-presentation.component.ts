import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

@Component({
  selector: 'app-recherche-presentation',
  templateUrl: './recherche-presentation.component.html',
  styleUrls: ['./recherche-presentation.component.css']
})
export class RecherchePresentationComponent implements OnInit {
  public recherches: any[];
  public title : string;

  //
  public selectedrecherche: any;
  public submitted: boolean;
  public errorMessage : string;
  constructor(
      private malihuScrollbarService : MalihuScrollbarService,
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute, private router: Router,
    private translate: TranslateService
    ) { 
      this.translate.get("RechercheRequired").subscribe((res:string) => {
        //console.log(res);
        this.errorMessage = res;
      });
    }
    ngAfterViewChecked() {
        this.malihuScrollbarService.initScrollbar('#content', { axis: 'y',
        'scrollbarPosition':"outside"
        });

    }


    ngOnInit() {
    this.sharedDataService.getEtapeInscription()
    .subscribe(etape => {
        if(etape <7)
        {
          this.router.navigate(['/splashcreen']);
        }
    });

    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape7")
      this.recherches = etape.value;
      //console.log(inscriptionsteps.etapes);
      this.title = etape.title;
    

      this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      if(inscription)
      {
        this.selectedrecherche = this.recherches.find((item) => item.id === inscription.id_recherche);
        if(
          inscription.id_pratique && 
          inscription.id_pratique.length &&
          inscription.id_tendance &&
          inscription.id_situation &&
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
    if(this.selectedrecherche){
      this.sharedDataService.setErrorsOnSubscribe([]);
      this.sharedDataService.setEtapeInscription(8);
      this.router.navigate(['/inscription/compte']);
    }
    else{
      this.submitted = true; 
    }
  }
  public onSelect(selectedItem: any): void {
    this.malihuScrollbarService.scrollTo('#content', 'bottom', { scrollInertia: 0 });
    this.submitted = false; 
    this.selectedrecherche = selectedItem;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {      
      //console.log(selectedItem);
      inscription.id_recherche = selectedItem.id;
      //console.log(inscription);
    });
  }

}
