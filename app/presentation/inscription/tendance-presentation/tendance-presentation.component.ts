import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

@Component({
  selector: 'app-tendance-presentation',
  templateUrl: './tendance-presentation.component.html',
  styleUrls: ['./tendance-presentation.component.css']
})
export class TendancePresentationComponent implements OnInit {
  public tendances: any[];
  public title : string;
  //
  public selectedtendance: any;
  public submitted: boolean;
  public errorMessage : string;
    public backUrl : string;
    public isCouple : boolean;

  constructor(
      private malihuScrollbarService : MalihuScrollbarService,
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute, private router: Router,
    private translate: TranslateService
    ) {
      this.translate.get("TendanceRequired").subscribe((res:string) => {
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
        if(etape <5)
        {
          this.router.navigate(['/splashcreen']);
        }
    });

    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape5")
      this.tendances = etape.value;
      //console.log("inscription step",inscriptionsteps.etapes);
      this.title = etape.title;
    

    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      this.isCouple = false;
        this.backUrl = "/inscription/orientation";
     let vousetes = etapes.find((item) => item.etape === "etape1")
      if(inscription)
      {
        this.selectedtendance = this.tendances.find((item) => item.id === inscription.id_tendance);
        //console.log( this.selectedtendance );
          if(inscription.id_vsetes){
              let selectedVe = vousetes.value.find((item) => item.id === inscription.id_vsetes);
              if(selectedVe && selectedVe.label && selectedVe.label.toLocaleLowerCase().indexOf("couple") !== -1)
              {
                  this.isCouple = true ;
                  this.backUrl = "/inscription/statut";
              }
          }
        if(
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
    if(this.selectedtendance){
      this.sharedDataService.setEtapeInscription(6);
      this.router.navigate(['/inscription/pratique']);
    }
    else{
      this.submitted = true; 
    }
  }
  public onSelect(selectedItem: any): void {
      this.malihuScrollbarService.scrollTo('#content', 'bottom', { scrollInertia: 0 });
    this.submitted = false; 
    this.selectedtendance = selectedItem;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {      
      //console.log("select",selectedItem);
      inscription.id_tendance = selectedItem.id;
      //console.log(inscription);
    });
  }

}
