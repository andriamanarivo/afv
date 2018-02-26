import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { mockinscription } from '../../../donnee/inscription/mock-inscription';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { 
  InscriptionApplicatifServiceACI
 } from '../../../service/applicatif/inscription';

@Component({
  selector: 'app-vousetes-presentation',
  templateUrl: './vousetes-presentation.component.html',
  styleUrls: ['./vousetes-presentation.component.css']
})
export class VousetesPresentationComponent implements OnInit {

  public vousetes: any[]; 

  public title : string;
  public selectedVe: any;
  public submitted: boolean;
  public errorMessage : string;
  idsite : String;
  sitename : string;
  lastlabel : string = "Trans / Trav";

  etapeInscription : number;

  constructor(
      private malihuScrollbarService : MalihuScrollbarService,
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute,
    private inscriptionApplicatifServiceACI : InscriptionApplicatifServiceACI,
    private router: Router,
    private translate: TranslateService
    ) {
      this.translate.get("VousEtesRequired").subscribe((res:string) => {
        //console.log(res);
        this.errorMessage = res;
      });

      //this.etapeInscription = 0;

      
     }
    ngAfterViewChecked() {
        this.malihuScrollbarService.initScrollbar('#content', { axis: 'y',
        'scrollbarPosition':"outside"
        });

    }

  ngOnInit() {

    
    this.sharedDataService.getEtapeInscription()
    .subscribe(etape => {
        if(etape <1)
        {
          this.router.navigate(['/splashcreen']);
        }
    });
    
    
    
    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
    //   console.log(inscriptionsteps);
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape1")
      //console.log(inscriptionsteps.etapes);
      this.vousetes = etape.value;
        this.title = etape.title;

        this.idsite = etape.idsite;
        this.sitename = etape.sitename;
        

        this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
          if(inscription)
          {
            this.selectedVe = this.vousetes.find((item) => item.id === inscription.id_vsetes);
          }
          
          //console.log( this.selectedVe );
        });
    });
    
    
  }

  getVousEtes(){
    let index;
    let listSexe = [];
    for(var i in this.vousetes){
        if(this.vousetes[i].label === this.lastlabel){
            index = i;
        } else {
            listSexe.push(this.vousetes[i]);
        }
    }
    listSexe.push(this.vousetes[index]);
    return listSexe;
  }

  public onSubmit() {
    
    if(this.selectedVe){
      this.sharedDataService.setEtapeInscription(2);
      this.router.navigate(['/inscription/statut']);      
      //this.inscriptionTest();      
    }
    else{
      this.submitted = true; 
    }
  }

  errorCallback(err: string, title?: string) {
    this.errorMessage = err;
    this.submitted = true; 
  }
  public inscriptionTest() {
      this.inscriptionApplicatifServiceACI.postInscription(mockinscription).subscribe(inscription => {
        console.log(inscription);
        if (inscription) {
          if (!inscription.error) {
              this.errorMessage ="Inscription reussi";
          }
          else {
              this.errorCallback(inscription.error);
          }
        }
        
      },
      err => {
          console.log(err);
      });
  }



  public onSelect(selectedVe: any): void {
      this.malihuScrollbarService.scrollTo('#content', 'bottom', { scrollInertia: 0 });
    //this.selectedHero = hero;
    // console.log(selectedVe.id);
    this.submitted = false; 
    this.selectedVe = selectedVe;
    this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
      //console.log(inscription);
      inscription.id_vsetes = selectedVe.id;
      inscription.idsite = this.idsite;
      inscription.sitename = this.sitename 
    });
  }

}
