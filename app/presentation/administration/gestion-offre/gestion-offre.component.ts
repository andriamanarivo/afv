import { Component, OnInit, EventEmitter, ViewChild,ElementRef} from '@angular/core';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { SharedService } from '../../../commun/shared-service';
import { Router } from "@angular/router";
import { FormGroup,FormBuilder,FormControl, Validators, AbstractControl} from '@angular/forms';
import { DatePickerComponent, ModalDirective} from 'ngx-bootstrap';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';

@Component({
  selector: 'app-gestion-offre',
  templateUrl: './gestion-offre.component.html',
  styleUrls: ['./gestion-offre.component.css']
})
export class GestionOffreComponent implements OnInit {
rows: Array<any> = [];
    showDetailEvent = new EventEmitter();
    listOffre = [];
    length = 0;
    columns: Array<any> = [
        { title: 'Titre', name: 'titre', sort: false },
        { title: 'Prix', name: 'prix', sort: false },
        { title: 'Unité prix', name: 'unit', sort: false },
        { title: 'Période', name: 'periodeName', sort: false },
        { title: 'Durée', name: 'duree', sort: false },
        { title: 'Condition paiement', name: 'conditionPaiment', sort: false },
        { title: 'Description', name: 'description', sort: false },
        { title: 'Actif', name: 'active', sort: false },
        { title: 'Onepay', name: 'onepay', sort: false },
    ];
    title:string;
    buttonName:string;
    createOrUpdate:number;
    addAvantage:any=[];
    comtpe:number=0;
    visibilities: boolean[] = new Array(this.addAvantage.length).fill(false);
    textModel: string[] = new Array(this.addAvantage.length).fill('');
    idOffre:number;
    name:string;
    prix:number;
    unite:number;
    periode:number;
    statut:boolean;
    onepay:boolean;
    duree:number;
    dureeUnit:string;
    condition:string;
    description:string;
    avantage: any[] = [];

    page: number = 1;
    itemsPerPage: number = 20;
    maxSize: number = 5;
    numPages: number = 1;    
    loading: boolean = false;
    
    config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
    };
    offreForm : FormGroup;
    filtre: any;
    periodes=[
                {id: '1', libelle: 'heure'},
                {id: '2', libelle: 'jour'},
                {id: '3', libelle: 'mois'},
                {id: '4', libelle: 'Ans'},
            ]
    itemSelected:number;
    @ViewChild('childModalCree') public childModalCree:ModalDirective;
    constructor(private adminService: AdministrationApplicatifServiceACI, 
                private sharedService: SharedService, 
                private router: Router,
                private fb: FormBuilder,
                private homeApplicatifServiceACI: HomeApplicatifServiceACI
                ) { 
                    this.offreForm= fb.group({
                        "title" : ['',Validators.required],
                        "prix" : [''],
                        "unite":[''],
                        "periode":[''],
                        "statut":[''],
                        "duree":[''],
                        "dureeUnit":[''],
                        "condition":[''],
                        "description":[''],
                        "onepay":[''],
                        "avantage":this.fb.array(this.avantage)
                    });
                }
    ngOnInit() {
        this.getListOffre(1);
    }

    getListOffre(page): void {
        let offset = 10 * (page - 1) ;        
        this.loading = true;
        this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.itemsPerPage });     
    }
    changeItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.onChangeTable(this.config);
    }
    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }

        this.changePage(page, this.listOffre);
    }

    public changePage(page: any, data: Array<any> = this.listOffre) {
        this.loading = true;
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        let eventPage:number=page.page;
        this.homeApplicatifServiceACI.getOffres({first:eventPage, max:this.itemsPerPage}).subscribe(listeOffre => {
            this.loading = false;
            let offres = listeOffre.results;
            if(offres.length>0){
                for (let i=0; i < offres.length;i++){
                    let checked="";
                    let checkedpay="";
                    if(offres[+i].actif){
                        checked='checked';
                    }
                    if(offres[+i].iSonepay){
                        checkedpay='checked';
                    }
                    offres['statusValue'] = checked;
                    offres['onpayvalue'] = checkedpay;   
                    console.log(offres[+i]);              
                    if (offres[+i]['actif']) {
                        offres[+i]['active'] = '<button type="button"  disabled class="btn btn-success">Oui</button>';
                    } else {
                        offres[+i]['active'] = '<button type="button"  disabled class="btn btn-success">Non</button>';
                    }
                    // offres[+i]['active']='<div class="toggle-switch"><input type="checkbox" '+checked+' class="toggle-switch__checkbox" ><i class="toggle-switch__helper"></i></div>';
                    // offres[+i]['onepay']='<div class="toggle-switch"><input type="checkbox" '+checkedpay+' class="toggle-switch__checkbox" ><i class="toggle-switch__helper"></i></div>';
                    if (offres[+i]['iSonepay']) {
                        offres[+i]['onepay'] = '<button type="button"  disabled class="btn btn-success">Oui</button>';
                    } else {
                        offres[+i]['onepay'] = '<button type="button"  disabled class="btn btn-success">Non</button>';
                    }
                }
            }
            this.rows = offres;
            this.length = listeOffre.nbResults;
        },
        err=>{
            this.loading = false;
            console.log("ERROR");
        });
    }

    getEmptyMessage(): string {
        return  this.rows &&  this.rows.length > 0 ? '' : 'Aucun résultat';
    }

    public onCellClick(data: any): any {
        console.log(data);
        this.title="Modifier  offre";
        this.buttonName="Modifier";
        this.createOrUpdate=0;
        
        this.idOffre=data.row.id;
        this.name=data.row.titre;
        this.prix=data.row.prix;
        this.unite=data.row.unit;
        this.itemSelected=data.row.periodeId;
        this.statut=data.row.actif;
        this.duree=data.row.duree;
        this.dureeUnit=data.row.dureeUnit;
        this.condition=data.row.conditionPaiment;
        this.description=data.row.description;
        this.onepay=data.row.iSonepay;
        this.addAvantage=data.row.avantages;
        if(data.row.avantages.length>0){
            for (let i=0; i < data.row.avantages.length;i++){
                this.visibilities[+i]=true;
                this.comtpe=i;
                let control: FormControl = new FormControl('', Validators.required);
                this.offreForm.addControl('avantage'+i,control);
                this.avantage[+i]='avantage'+i;
                this.addAvantage[+i].nameControler='avantage'+i;
                this.textModel[+i]=data.row.avantages[i].description;
            }
        }else{
            this.visibilities[0]=true;
            this.comtpe=0;
            let control: FormControl = new FormControl('', Validators.required);
            this.offreForm.addControl('avantage0',control);
            this.avantage[0]='avantage0';
            this.textModel[0]='';
        }
     
        const dataOffre ={
            id: data.row.id,
            title : data.row.titre,
            prix :  data.row.prix,
            unite: data.row.unit,
            periode: data.row.periodeId,
            statut: data.column === 'active' ? !data.row.actif : data.row.actif, 
            duree: data.row.duree,
            avantages: data.row.avantages.map(a=>{return a.description}),
            dureeUnit: data.row.dureeUnit,
            description: data.row.description,
            condition: data.row.conditionPaiment,
            onepay: data.column === 'onepay' ? !data.row.iSonepay : data.row.iSonepay 
        };

        console.log(dataOffre);      
        if(data.column === 'active' || data.column === 'onepay'){
            this.homeApplicatifServiceACI.updateOffre(JSON.stringify(dataOffre)).subscribe(res => {
                this.onChangeTable(this.config);            
            },
            err=>{
                console.log("ERROR");
            });
        } else {
            this.childModalCree.show();
        }      
    }

    errorCallback(err): void{
        console.log(err);
        this.loading = false;
    }

    public openFormCreate(){
        this.visibilities[0]=true;
        this.comtpe=0;
        let control: FormControl = new FormControl('', Validators.required);
        this.offreForm.addControl('avantage0',control);
        this.avantage[0]='avantage0';
        this.textModel[0]='';
        this.title="Créer  offre";
        this.buttonName="Créer";
        this.createOrUpdate=1;
        this.addAvantage=[];
        this.idOffre=null;
        this.name='';
        this.prix=null;
        this.unite=null;
        this.itemSelected=1;
        this.statut=false;
        this.duree=null;
        this.dureeUnit=null;
        this.condition=null;
        this.description=null;
        this.onepay=false;
        this.childModalCree.show();
    }

    public onDeleteCancel(){
        this.addAvantage=[];
        this.idOffre=null;
        this.name='';
        this.prix=null;
        this.unite=null;
        this.itemSelected=null;
        this.statut=false;
        this.duree=null;
        this.onepay=false;
        this.textModel[0]='';
        this.childModalCree.hide();
    }

    public addChamp(index){
        let cpt=this.comtpe + 1;
        
        let control: FormControl = new FormControl('', Validators.required);
        this.offreForm.addControl('avantage'+cpt,control);
        this.addAvantage.push({description:'',nameControler:'avantage'+cpt})
        this.avantage[+cpt]='avantage'+cpt;
        this.visibilities.push(true);
        this.comtpe=cpt;
    }

    public removeChamp(index){
        this.textModel[index]='';
        this.addAvantage.splice(index, 1)
    }

    public createOrUpdateOffre(form:FormGroup){
         let avantages=[];
         for (let i=0; i < this.textModel.length;i++){
             if(this.textModel[i]!==''){
                avantages.push(this.textModel[i]);
             }
         }
         if(this.createOrUpdate===1){
             let data ={"title" :form.value.title,"prix" : form.value.prix,"unite":form.value.unite,"periode":form.value.periode,"statut":form.value.statut,"duree":form.value.duree,"avantages":avantages,"dureeUnit":"Y","description":form.value.description,"condition":form.value.condition,"onepay":form.value.onepay};
             console.log(data);
             this.homeApplicatifServiceACI.createOffre(JSON.stringify(data)).subscribe(res => {
                 this.onChangeTable(this.config);
                 this.childModalCree.hide();
            },
             err=>{
                 console.log("ERROR");
             });
         }else{
             let data ={"id":this.idOffre,"title" :form.value.title,"prix" : form.value.prix,"unite":form.value.unite,"periode":form.value.periode,"statut":form.value.statut,"duree":form.value.duree,"avantages":avantages,"dureeUnit":"Y","description":form.value.description,"condition":form.value.condition,"onepay":form.value.onepay};
             console.log(JSON.stringify(data));
             console.log(data);             
             this.homeApplicatifServiceACI.updateOffre(JSON.stringify(data)).subscribe(res => {
                 this.onChangeTable(this.config);
                 this.childModalCree.hide();
             },
             err=>{
                 console.log("ERROR");
             });
        }
    }

}
