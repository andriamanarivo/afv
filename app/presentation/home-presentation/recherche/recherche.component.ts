import { Component, OnInit,AfterViewInit, Input, Output, ChangeDetectorRef  } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { Home } from '../../../donnee/home/home';
import { Router, CanActivate } from '@angular/router';
import { PagerService } from '../../../service/pager.service';
import {SharedService} from '../../../commun/shared-service';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import {AutorisationService} from '../../../commun/autorisation.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { HomePresentationComponent } from '../../../presentation/home-presentation/home-presentation.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalConfirmComponent } from 'app/presentation/home-presentation/modal-confirm/modal-confirm.component';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrls: ['./recherche.component.css']
})
export class rechercheComponent implements OnInit {
    deletingSearch: boolean;
    searchToRemove: any;
    myControl: FormControl = new FormControl();
    public option;
    isAutocompleteSelected = false;
    rangeValues: number[] = [0, 3000];
    options = ['test'];
    filteredOptions: Observable<string[]>;
    private router: Router;
    p: number = 1;
    size: number = 4;
    identifiant: string;
    public homes?: any;
    public baseUrl: String;
    public grilleMode: boolean = true;
    public titreRechercheDefault: string = 'recherche par défaut';
    color = 'primary';
    public defaultSearchName: string = 'aucune';
    public defaultSearchText: string = 'aucune';
    public progresValue: number = 50;
    bufferValue = 75;
    public showContents: boolean = false;
    private allItems: any[];
    public plusFiltre: boolean = false;
    public defaultBoolean: boolean = false;
    public isFiltre: boolean = false;
    public filtreLabel: string = 'Plus de critères';
    public rencontres: any = [];
    public pratiques: any = [];
    public tendances: any = [];
    public recherches: any = [];
    public localisation: any = [];
    public sexes: any = [];
    public data: any = {};
    public dataFiltre: any = {};
    public recherche: any = {};
    public classeContent: string = 'scroldown-content-hide';
    public ages = [];
    minAgeAuthorized = 18;
    maxAgeAuthorized = 99;
    showListSearch = false;
    // pager object
    pager: any = {};
    public dataSend: any;
    public grille: boolean = true;

    // paged items
    pagedItems: any[];

    totalItems: number;
    loading: boolean = false;
    tries: any[];
    public trie: string;
    public photos = [
        { value: true, viewValue: 'Oui', classe: 'rdo-lft-1' },
        { value: false, viewValue: 'Non', classe: 'rdo-rgt-2' }
    ];
    public dataBoolean = [
        { value: false, viewValue: 'En ligne', classe: 'rdo-lft' },
        { value: false, viewValue: 'Hors ligne', classe: 'rdo-rgt' }
    ];
    myContent: any[] = [];
    public search: string = 'rechercher';
    public iconeDown: string = 'assets/img/scrolldown.png';
    public autorisation;
    enLigne = false;
    horsLigne = false;
    public pseudoNome='';

    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
                private pagerService: PagerService,
                public SharedDataService : SharedDataService,
                private cdr: ChangeDetectorRef,
                public sharedService: SharedService,
                private appConfig : AppConfig,
                private bsModalRef : BsModalRef,
                private modalService: BsModalService,
                private autorisationService : AutorisationService,
                private homePresentationComponent :HomePresentationComponent
        ) { }

    ngOnInit() {
        if(window.screen.width<=1024){
            this.grille=false;
        }
        this.autorisation = this.autorisationService.getAutorisation();
        this.tries = this.tableauTrie(this.autorisation);
        this.trie = null;
        // this.trie = this.tries[0].value;
        for (var i = this.minAgeAuthorized; i <= this.maxAgeAuthorized; i++) {
            this.ages.push(i);
        }
        this.filteredOptions = this.myControl.valueChanges
            .startWith(null)
            .do(name => { this.search = name; })
            .flatMap(name => this.homeApplicatifServiceACI.rechercheAutocomplete(name));

        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/','');
        this.data = {
            'pseudo': '',
            'uidSearch': '',
            'ageMax': null,
            'ageMin': null,
            'rencontre': '',
            'localisation': '',
            'tendances': '',
            'pratiques': ['', '', ''],
            'isConnected': null,
            'isDefault': null,
            'avecPhoto': null,
            'libelle': ''
        }
        // this.initRecherche();
        this.initStateConnexionData();
    }
    public autocompleteSelected(e, data){


        if (e.source.selected) {
            this.isAutocompleteSelected = true;
            this.dataSend = {
                'pseudo':data,
                'uidSearch':'',
                'ageMax':null,
                'ageMin' :null,
                'rencontre':'',
                'localisation':'',
                'tendances':'',
                'pratiques':['','',''],
                'isConnected': null,
                'isDefault':null,
                'avecPhoto':null,
                'isSearch':true,
                'postRequest':true,
                'libelle':''
            };
        }

    }
    public handleKeyDown(event: any, data) {
        if(event.key === 'Enter') {
                
            if (!this.isAutocompleteSelected) {
                let datas = {
                    'pseudo':'',
                    'searchPseudo':'',
                    'uidSearch':'',
                    'order':'',
                    'ageMax':null,
                    'ageMin' :null,
                    'rencontre':'',
                    'localisation':[],
                    'tendances':'',
                    'pratiques':['','',''],
                    'isConnected': null,
                    'isDefault':null,
                    'avecPhoto':null,
                    'libelle':''};
                datas = this.clone(this.data);
                datas.localisation = this.rangeValues;
                datas.pseudo = this.search;
                datas.searchPseudo = this.search;
                datas.order = this.trie;
                this.dataSend = this.clone(datas);
                this.dataSend.isSearch = true;
            }
            this.dataSend.postRequest = true;
            this.isAutocompleteSelected = false;
        }
    }
    onClick(event): void{        
        var target = event.target || event.srcElement;
        if (target.id !== 'listsearch' && target.id !== 'selectedsearch' && target.id !== 'deletebutton' && target.id !== 'accept' && target.id !== 'deleteicon'){
            this.showListSearch = false;
        }
    }
    public confirmRemoveSearch(search: any) {
        this.searchToRemove = search;
        this.bsModalRef = this.modalService.show(ModalConfirmComponent);
        var modalComponent = this.bsModalRef.content as ModalConfirmComponent;
        let data = {
            'title': 'Confirmation suppression',
            'content': 'Voulez-vous vraiment supprimer cette recherche?'
        }
        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                if (result.data) {
                    this.removeSearch(this.searchToRemove);
                }
            }
        });
    }
    updateDefaultSearch(): void{
        this.data.isDefault = ! this.data.isDefault;
    }
    removeSearch(search:any): void{
        this.deletingSearch = true;
        this.homeApplicatifServiceACI.removeSearch(search)
            .subscribe(res=>{
                if (!res["errorExist"]) {
                    this.recherches.forEach((s, index) => {
                        if (s.uidSearch === search.uidSearch) {
                            this.recherches.splice(index, 1);
                            if (search.uidSearch === this.recherche.uidSearch) {
                                this.reset();
                                this.recherche = {};
                            }
                        }
                    });
                    this.deletingSearch = false;
                    this.searchToRemove = {};
                } else {
                    //{"statut":200,"errorExist":false,"result":["success"],"error":[]}
                }
            },err=>{
                this.deletingSearch = false;
                if(err === '401 - Unauthorized'){
                    this.router.navigate(['/splashcreen']);
                }
            });
    }
    setDefaultFilter(): void{
        this.data.sexe = '';
        this.data.tendances = '';
        this.data.pratiques = ['','',''];
    }
    initRechercheEvent(params):void{
        this.recherches = params;
        this.setDefaultFilter();
        this.recherches.forEach((data)=>{
            if(data && data.isDefault){
                this.titreRechercheDefault='recherche par défaut';
                this.defaultSearchText=this.getRechercheText(data);
                localStorage.setItem('SearchText', this.defaultSearchText);
                this.defaultSearchName = data && data.uidSearch ?  data.uidSearch : '';
                this.recherche= data;
                if(data.pratiques.length==0){
                    data.pratiques = ['','',''];
                }
                if(data.sexe==null){
                    data.sexe = '';
                }
                if(data.tendances==null){
                    data.tendances = '';
                }
                this.data= data;                
                this.initStateConnexionData();
                this.rangeValues = this.toIntLocalisation(this.data.localisation);
                this.isFiltre= true;
                this.dataFiltre = data;
                this.find(1,0, true)
            }else{
                // this.titreRechercheDefault="recherche en cours";
                // this.defaultSearchText=this.getRechercheText(data);
            }
        })
        if(!this.isFiltre){
            this.find(1,0, true);
        }
        this.homeApplicatifServiceACI.getFormRecherche().subscribe(form => {
            this.rencontres= form.rencontre;
            this.pratiques = form.pratiques;
            this.sexes = form.sexe;
            this.tendances = form.tendances ;
        });
    }
    private initStateConnexionData(): void {
        if (this.data.isConnected === null) {
            this.enLigne = null;
            this.horsLigne = null;
        } else {
            this.enLigne = this.data.isConnected === 1 || this.data.isConnected === true ? true : false;
            this.horsLigne = this.data.isConnected === 0 || this.data.isConnected === false ? true : false;
        }
    }
    public initRecherche(){
        this.dataFiltre = this.data;
        this.homeApplicatifServiceACI.getListRecherche().subscribe(res => {
            this.recherches = res;
            this.setDefaultFilter();
            let hasDefaultSearch = res.find(s=>{return s.isDefault});
            res.forEach((data)=>{
                if(data && data.isDefault){
                    this.titreRechercheDefault='recherche par défaut';
                    this.defaultSearchText=this.getRechercheText(data);
                    sessionStorage.setItem('search', this.defaultSearchText);
                    this.defaultSearchName = data && data.uidSearch ? data.uidSearch : '';
                    this.recherche= data;
                    this.data= data;
                    this.rangeValues = this.toIntLocalisation(this.data.localisation);
                    this.isFiltre= true;
                    this.dataFiltre = data;
                    this.find(1,0)
                }else{
                    sessionStorage.removeItem('search');
                    // this.titreRechercheDefault="recherche en cours";
                    // this.defaultSearchText=this.getRechercheText(data);
                }
            })
            if(!hasDefaultSearch){
                this.reset();
            }
            if(!this.isFiltre)
                this.find(1,0);

        });
        this.homeApplicatifServiceACI.getFormRecherche().subscribe(form => {
            this.rencontres= form.rencontre;
            this.pratiques = form.pratiques;
            this.sexes = form.sexe;
            this.tendances = form.tendances ;
        });
    }
    public onChangeCheck ($event,data){
        if(data =='isDefault')
            this.data.isDefault = !$event.target.checked;
        if(data =='withPhoto')
            this.data.avecPhoto = !$event.target.checked;
        if(data =='connect'){
            this.data.isConnected = !$event.target.checked;
            this.data.isConnected = this.data.isConnected ? 1: 0;
        }

    }

    public showContent(){
        if(this.showContents){
            this.showContents = false;
            this.classeContent = 'scroldown-content-hide';
            this.iconeDown = 'assets/img/scrolldown.png';
        }
        else{
            this.showContents=true;
            this.classeContent = 'scroldown-content-show';
            this.iconeDown = 'assets/img/scroll-upx1.png';
        }
    }

    public onBlur(){
        this.classeContent = 'scroldown-content-hide';
    }

    public changeFiltre(){
        if(this.plusFiltre){
            this.plusFiltre = false;
            this.filtreLabel =  'Plus de critères';

        }
        else{
            this.plusFiltre = true;
            this.filtreLabel ='Moins de critères' ;
        }
    }
    public toIntLocalisation(localisation){
        if(localisation && localisation.length>1 &&typeof(localisation) == 'object'){
            let min = parseInt(localisation[0]);
            let max = parseInt(localisation[1]);
            return [min,max];
        }
        else
            return [0,3000]

    }

    statutConnexionChange(choix): void{
       if(this.enLigne && this.horsLigne){
           if(choix === 'enligne'){
            this.horsLigne = false;
           }  else{
            this.enLigne = false;
           }
       }
       this.data.isConnected = this.enLigne ? 1 : 0;
       if(!this.enLigne && !this.horsLigne){
        this.data.isConnected =   null;
       }
    }

    public changeRecherche(recherche?: any){
        this.recherche = recherche;
        this.data = this.recherche;
        this.titreRechercheDefault='recherche en cours';
        this.defaultSearchName=this.data && this.data.uidSearch ? this.data.uidSearch : '';
        this.defaultSearchText=this.getRechercheText(this.data);
        localStorage.setItem('SearchText', this.defaultSearchText);
        this.rangeValues = this.toIntLocalisation(this.recherche.localisation);
        let data = this.clone(this.data);
        data.order = this.trie;
        data.isSearch = true;
        this.dataSend = data;
        this.dataSend.isInitSearch = false;
        this.dataSend.postRequest = true;
        this.initStateConnexionData();
        this.showListSearch = false;
        this.classeContent = 'scroldown-content-hide';
        this.showContents = false;
        this.iconeDown = 'assets/img/scrolldown.png';
    }
    public changeTrie(){
        let data = this.clone(this.dataSend);
        data.localisation= this.rangeValues;

        data.order = this.trie;
        data.isSearch=true;

        data.isInitSearch = false;
       this.dataSend = this.clone(data);
        this.dataSend.order =  this.trie;

    }

    public addSearch(){
        if(this.data.uidSearch){
            this.data.libelle = this.data && this.data.uidSearch ? this.data.uidSearch : '';
            this.data.localisation = this.rangeValues;
            this.homeApplicatifServiceACI.create_Search(this.data).subscribe((res)=>{
                this.initRecherche();
                this.classeContent = 'scroldown-content-hide';
                this.showContents = false;
                this.iconeDown = 'assets/img/scrolldown.png';
            })
        }


    }

    public reset(){

        this.recherche = {};
        this.isFiltre = false;
        this.showContents = false;
        this.rangeValues = [0,3000];

        let data = {
            'pseudo':'',
            'uidSearch':'',
            'ageMax':null,
            'ageMin' :null,
            'rencontre':'',
            'localisation':[0,3000],
            'tendances':'',
            'pratiques':['','',''],
            'isConnected': null,
            'isDefault':null,
            'avecPhoto':null,
            'libelle':''
        };
        this.enLigne =false;
        this.horsLigne =false;
        let data1 = this.clone(data);
        this.dataFiltre = data;
        this.data = data;
        data1.order = this.trie;
        this.dataSend = this.clone(data1);
        this.dataSend.isSearch = true;
        this.dataSend.postRequest = false;
        this.classeContent = 'scroldown-content-hide';
        this.iconeDown = 'assets/img/scrolldown.png';
    }

    // init est à true uniquement dans initRechercheEvent
    public find(page,enCours, init?:boolean){

        this.cdr.detectChanges();
        this.SharedDataService.test = 'testSEarch'
        let data;
        this.classeContent = 'scroldown-content-hide';
        this.showContents = false;
        data = this.clone(this.data);
        if(!this.plusFiltre){
            data.tendances='';
                data.pratiques= ['','',''];
                data.isConnected = null;
               this.initStateConnexionData();
                data.isDefault = null;
                data.avecPhoto = null;
                data.libelle = '';
        }
        this.dataFiltre = data;
        this.isFiltre = true;
        data.order =  this.trie;
        data.localisation = this.rangeValues;
        this.dataSend = data;
        this.dataSend.postRequest = true;
        this.dataSend.isInitSearch = init;

        for (var i in this.rencontres) {
            if(this.rencontres[i].uidRencontre === data.rencontre){
                data.libRencontre = this.rencontres[i].libelle;
            }
        }
        for (var i in this.sexes) {
            if(this.sexes[i].uidVousEtes === data.sexe){
                data.libSexe = this.sexes[i].libelle;
            }
        }
        if(enCours == 1){
            this.titreRechercheDefault = 'recherche en cours';
            this.defaultSearchText = this.getRechercheText(data);
            localStorage.setItem('SearchText', this.defaultSearchText);
            this.iconeDown = 'assets/img/scrolldown.png';
        }

    }
    public clone(obj){
        try{
            var copy = JSON.parse(JSON.stringify(obj));
        } catch(ex){
            alert('erreur');
        }
        return copy;
    }
    public changeList(type) {
        if (type == 'grille')
            this.grille = true;
        else
            this.grille = false;

    }

    getRechercheText(data){
        let message ='';
        if(data.sexe){
                message += data.libSexe;
        }

        if(data.ageMin || data.ageMax){
                if(data.ageMax === 500){
                    data.ageMax = 0;
                }
                if(data.ageMin === 0){
                    data.ageMin = 0;
                }
                // data.ageMin = data.ageMin ? data.ageMin : 18;
                // data.ageMax = data.ageMax ? data.ageMax : 99;
                if(data.ageMin && data.ageMax){
                    message += ' de '+data.ageMin + ' à ' + data.ageMax + ' ans';
                }
                if (data.ageMin && !data.ageMax){
                    message += ' de plus de ' + data.ageMin + ' ans';
                }
                if (!data.ageMin && data.ageMax){
                    message += ' de moins de ' + data.ageMax + ' ans';
                }
        }

        if (data.rencontre){
            message += ' pour ' + data.libRencontre;
        }

        if (data.localisation[1] != undefined){
            message += ' autour de ' + data.localisation + ' Km';
        }

        if (message === ''){
            message = 'aucun';
        }

        return message.replace(',', ' à ');
    }

    tableauTrie(autorisation): any{
        let tries = [];

        if (autorisation['RES_4']){
            tries.push({value: 'age', viewValue: 'age'});
        }
        if (autorisation['RES_3']){
            tries.push({value: 'firstName', viewValue: 'ordre alphabétique'});
        }
        if (autorisation['RES_6']){
            tries.push({value: 'dist', viewValue: 'distance'});
        }

        if (autorisation['RES_5']){
            tries.push({value: 'tendance', viewValue: 'tendance'});
        }

        if (tries.length === 0){
            tries.push({value: '', viewValue: 'aucun'});
        }
         
        if (!autorisation['RE_PRO_2']){
            this.pseudoNome="serchPseudo";
        }

        return tries;
    }

}
