import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import {TwoColumnPipe} from '../../../presentation/shared/shared-pipe/two-column.pipe';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
declare const $;

@Component({
  selector: 'app-pratique-presentation',
  templateUrl: './pratique-presentation.component.html',
  styleUrls: ['./pratique-presentation.component.css']
})
export class PratiquePresentationComponent implements OnInit {
  public pratiques: any[];
  public title : string;
  //public selectedpratique: any[] = [];
  public idpratiques: any[] = [];
    public pratique1 : any = {};
    public pratique2 : any = {};
    public pratique3 : any = {};
    public pratique4 : any = {};
    public pratique5 : any = {};
    public pratique6 : any = {};


  private minSelectedPratique : Number = 1;
   public submitted: boolean;
  public errorMessage : string;

  constructor(
    private sharedDataService : SharedDataService,
    private route: ActivatedRoute, private router: Router,
    private translate: TranslateService,
    private malihuScrollbarService : MalihuScrollbarService,
    ) { 
      this.translate.get("PratiqueRequired").subscribe((res:string) => {
        //console.log(res);
        this.errorMessage = res;
      });
    }
    
    ngAfterViewChecked() {
        this.malihuScrollbarService.initScrollbar('.mat-select-panel.mat-select-panel-done-animating',
         { axis: 'y',
          autoHideScrollbar: false,
            'scrollbarPosition':"inside",
        scrollButtons: {
            scrollAmount: 'auto', 
            enable: true 
        },callbacks:{
             onInit:function(){                 
                 $('.mCustomScrollBox').addClass('ScrollSpecial');
             },
         }

        });

    }
    
  ngOnInit() {
    this.sharedDataService.getEtapeInscription()
    .subscribe(etape => {
        if(etape <6)
        {
          this.router.navigate(['/splashcreen']);
        }
    });

    this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
      //let inscriptionsteps = this.route.snapshot.data['inscriptiondata'];
      let etapes = inscriptionsteps.etapes;
      let etape = etapes.find((item) => item.etape === "etape6")
      this.pratiques = etape.value;
        this.pratiques.forEach(function(data){
            data.disable = false;
            data.from= undefined;
        })
      //console.log(inscriptionsteps.etapes);
      this.title = etape.title;

      this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
        if(inscription)
          {
            this.idpratiques = inscription.id_pratique ? inscription.id_pratique : [];
              if(this.idpratiques.length>0)
                this.selectItems();
            //console.log( this.selectedVe );
            if(
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
              }
              */
          }
        
      });
    });
      
  }

  public onSubmit() {
    if(this.idpratiques.length >= this.minSelectedPratique){
      this.sharedDataService.setEtapeInscription(7);
      this.router.navigate(['/inscription/recherche']);
    }
    else{
      this.submitted = true; 
    }
  }
    selectItems(){
        let i = 1;
        this.idpratiques.forEach((data, index)=>{
            if(data === 'nesaitpasslug'){
               this.active = "pratique"+ (index+1);
            }
            this.pratiques.forEach((data1)=>{
                if(data== data1.id){
                    data1.disable = true;
                    data1.from="pratique"+i;
                    this[data1.from] = data;
                    i=i+1;
                }               
            })
        })
    }
    active = "";
    public select1(_data,_from){
        this.pratiques.forEach((data)=>{
            if(data.from == _from){
                data.disable=false;
                data.from = undefined;
                this.idpratiques.splice(this.idpratiques.indexOf(_data), 1);

            }
            else{
                if(data.id == _data){
                    data.disable = true;
                    data.from = _from;
                };
            }
          
            if(_data === 'nesaitpasslug'){
                //this.idpratiques = [];
                this.active = _from;  
                data.disable = false;                     
            } else {
                this.active = "";
            }
        })
        this.submitted = false;

        let itemExist = this.idpratiques.find(item =>item === _data);
        if(itemExist === undefined || this.idpratiques.length === 0)
        {
            this.idpratiques[this.idpratiques.length] = _data;
            this.sharedDataService.processinscriptionsteps.subscribe(inscription => {

                inscription.id_pratique = this.idpratiques;
            });
        }
        else
        {
            this.idpratiques.splice(this.idpratiques.indexOf(_data), 1);
            this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
                inscription.id_pratique = this.idpratiques;
            });
        }
    }

}
