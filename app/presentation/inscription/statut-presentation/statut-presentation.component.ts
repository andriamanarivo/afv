import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

@Component({
  selector: 'app-statut-presentation',
  templateUrl: './statut-presentation.component.html',
  styleUrls: ['./statut-presentation.component.css']
})
export class StatutPresentationComponent implements OnInit {

  public statuts: any[];
  public title : string;
  //
  public selectedstatut: any;
  public submitted: boolean;
  public errorMessage : string;
    public isCouple : boolean;

  constructor(
      private malihuScrollbarService : MalihuScrollbarService,
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
    ) { 
      this.translate.get("StatutRequired").subscribe((res:string) => {
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
        if(etape <2)
        {
          this.router.navigate(['/splashcreen']);
        }
    });
    
    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
        //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
        this.isCouple = false;
        if(inscription)
        {            
            let vousetes = etapes.find((item) => item.etape === "etape1")

            if(          
              inscription.id_vsetes){
                var allStepCompleted = true;
              }
              /*else
              {
                this.router.navigate(['/splashcreen']);
              }*/

            if(inscription.id_vsetes)
            {                
              let selectedVe = vousetes.value.find((item) => item.id === inscription.id_vsetes);
              if(selectedVe && selectedVe.label && selectedVe.label.toLocaleLowerCase().indexOf("couple") !== -1)
              {
                this.isCouple = true ;
                let etape = etapes.find((item) => item.etape === "etape2Couple")
                this.statuts = etape.value;
                //console.log(inscriptionsteps.etapes);
                this.title = etape.title;
                  //console.log( this.selectedstatut );
              }
            }
            
            if(!this.isCouple)
            {
              let etape = etapes.find((item) => item.etape === "etape2")
              this.statuts = etape.value;
              //console.log(inscriptionsteps.etapes);
              this.title = etape.title;
            }       
          
            this.selectedstatut = this.statuts.find((item) => item.id === inscription.id_statut);
            
          }
          
          
        });
      });
      
  }

  public onSubmit() {
    if(this.selectedstatut){
        if(!this.isCouple) {
            this.sharedDataService.setEtapeInscription(3);
            this.router.navigate(['/inscription/orientation']);
        }
        else{
            this.sharedDataService.setEtapeInscription(5);
            this.router.navigate(['/inscription/tendance']);
        }
    }
    else{
      this.submitted = true; 
    }
  }
  public onSelect(selectedItem: any): void {
      this.malihuScrollbarService.scrollTo('#content', 'bottom', { scrollInertia: 0 });
    this.submitted = false; 
    this.selectedstatut = selectedItem;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      //console.log(inscription);
      inscription.id_statut = selectedItem.id;
    });
  }

}
