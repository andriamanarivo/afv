import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-orientation-presentation',
  templateUrl: './orientation-presentation.component.html',
  styleUrls: ['./orientation-presentation.component.css']
})
export class OrientationPresentationComponent implements OnInit {
  public orientations: any[];
  public title : string;
  //
   public selectedorientation: any;
   public submitted: boolean;
  public errorMessage : string;
  constructor(
      private malihuScrollbarService : MalihuScrollbarService,
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
    ) { 
      this.translate.get("OrientationRequired").subscribe((res:string) => {
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
        if(etape <3)
        {
          this.router.navigate(['/splashcreen']);
        }
    });

    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape3")
      this.orientations = etape.value;
      //console.log(inscriptionsteps.etapes);
      this.title = etape.title;
    
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      if(inscription)
      {
        this.selectedorientation = this.orientations.find((item) => item.id === inscription.id_orientation);
        
        if(
          inscription.id_statut &&           
          inscription.id_vsetes){
            var allStepCompleted = true;
          }
          /*else
          {
            this.router.navigate(['/splashcreen']);
          }
          */
      }
        
        //console.log( this.selectedVe );
      });
    });
      
  }
  public onSubmit() {
    if(this.selectedorientation){
      this.sharedDataService.setEtapeInscription(5);
      this.router.navigate(['/inscription/tendance']);
    }
    else{
      this.submitted = true; 
    }
  }
  public onSelect(selectedItem: any): void {
      this.malihuScrollbarService.scrollTo('#content', 'bottom', { scrollInertia: 0 });
    this.submitted = false; 
    this.selectedorientation = selectedItem;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      //console.log(inscription);
      //console.log(selectedItem);
      inscription.id_orientation = selectedItem.id;
    });
  }

}
