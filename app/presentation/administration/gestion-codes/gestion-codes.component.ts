import { Component, OnInit, EventEmitter, ViewChild,ElementRef} from '@angular/core';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { SharedService } from '../../../commun/shared-service';
import { Router } from "@angular/router";
import { FormGroup,FormBuilder,FormControl, Validators, AbstractControl} from '@angular/forms';
import { DatePickerComponent, ModalDirective} from 'ngx-bootstrap';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';

@Component({
  selector: 'app-gestion-codes',
  templateUrl: './gestion-codes.component.html',
  styleUrls: ['./gestion-codes.component.css']
})
export class GestionCodesComponent implements OnInit {
    rows: Array<any> = [];
    showDetailEvent = new EventEmitter();
    listCode = [];
    length = 0;
    columns: Array<any> = [
        { title: 'Date début', name: 'dateDeb', sort: false },
        { title: 'Date fin', name: 'dateFin', sort: false },
        { title: 'Mot cle', name: 'code', sort: false },
        { title: 'Description', name: 'description', sort: false },
        { title: 'Actif', name: 'active', sort: false }
    ];
    title:string;
    buttonName:string;
    createOrUpdate:number;
    comtpe:number=0;
    idcodePromo:number;
    dateDeb;
    dateFin;
    code:number;
    typePromo = "0";
    valeur:string;
    offresId=[];
    statut =true;
    idCodePromo= "";
    offres = [];
    offresControl=[];
    libelleValeur="";
    page: number = 1;
    itemsPerPage: number = 20;
    maxSize: number = 5;
    numPages: number = 1;
    loading: boolean = false;
    errorMessage="";

    config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
    };
    codeForm : FormGroup;
    filtre: any;
    @ViewChild('childModalCree') public childModalCree:ModalDirective;
    constructor(private adminService: AdministrationApplicatifServiceACI,
                private sharedService: SharedService,
                private router: Router,
                private fb: FormBuilder,
                private homeApplicatifServiceACI: HomeApplicatifServiceACI
        ) {
        this.codeForm= fb.group({
            "dateDeb" : ['',Validators.required],
            "dateFin" : ['',Validators.required],
            "code":['',Validators.required],
            "statut":[''],
            "typePromo":['',Validators.required],
            "valeur":['',Validators.required],
            "offresControl" : this.fb.array(this.offresControl)
        });
    }
    ngOnInit() {
        this.getlistCode(1);
        this.getOffres();
    }

    getlistCode(page): void {
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

        this.changePage(page, this.listCode);
    }

    public changePage(page: any, data: Array<any> = this.listCode) {
        this.loading = true;
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        let eventPage:number=page.page;
        this.homeApplicatifServiceACI.getListCodesPromo({first:eventPage, max:this.itemsPerPage}).subscribe(listeOffre => {
                this.loading = false;
                let codesPromo = listeOffre.value;
                if(codesPromo.length>0){
                    for (let i=0; i < codesPromo.length;i++){
                        codesPromo[+i].dateDeb = this.formatDate(codesPromo[+i].dateDeb);
                        codesPromo[+i].dateFin = this.formatDate(codesPromo[+i].dateFin);
                        codesPromo[+i].description = codesPromo[+i].typePromo == "0"?  "reduction de "+codesPromo[+i].valeur+ "%" : "reduction de "+codesPromo[+i].valeur+ "€ sur le montant"
                        if (codesPromo[+i]['actif']) {
                            codesPromo[+i]['active'] = '<button type="button"  disabled class="btn btn-success">Oui</button>';
                        } else {
                            codesPromo[+i]['active'] = '<button type="button"  disabled class="btn btn-success">Non</button>';
                        }

                    }
                }
                this.rows = codesPromo;
                this.length = codesPromo.nbResult;
            },
            err=>{
                this.loading = false;
                console.log("ERROR");
            });
    }
    formatDate(date){
        let dates = new Date(date);
        let month = dates.getMonth()+1;
        let mois= month<10 ? "0"+month: month;
        let days= dates.getDate()<10 ? "0"+dates.getDate(): dates.getDate();
        return dates.getFullYear()+"-"+mois+"-"+days;
    }

    getEmptyMessage(): string {
        return  this.rows &&  this.rows.length > 0 ? '' : 'Aucun résultat';
    }

    public onCellClick(data: any): any {
        this.resetOffre();
        this.title="Modifier codes promo";
        this.buttonName="Modifier";
        this.createOrUpdate=0;
        data.row.idOffres.forEach(data=>{
            this.offres.forEach(data1=>{
                if(data == data1.id) data1.checked = true;
            })
        })
        this.idcodePromo=data.row.idcodePromo;
        this.dateDeb= data.row.dateDeb;
        this.dateFin=data.row.dateFin;
        this.code=data.row.code;
        this.typePromo=data.row.typePromo;
        this.valeur=data.row.valeur;
        this.statut = data.row.actif;
        this.childModalCree.show();

    }

    errorCallback(err): void{
        console.log(err);
        this.loading = false;
    }
    getOffres(): void {

        this.homeApplicatifServiceACI.getOffres("").subscribe(res => {
                let i =0;
                res.results.forEach(result =>{
                    result.checked = false;
                    result.nameControler='offres'+i;
                    this.offresControl[i] = 'offres'+i;
                    let control: FormControl = new FormControl('', Validators.required);
                    this.codeForm.addControl('offres'+i,control);
                    i++;
                })
                this.offres = res.results;
            }
        )
    }
    changeTypePromo(){
        this.typePromo == "0"? this.libelleValeur = "du pourcentage" : this.libelleValeur = "du montant";
    }
    resetOffre(){
        this.offres.forEach(data=>{
            data.checked = false;
        })
    }

    public openFormCreate(){
        this.comtpe=0;
        this.errorMessage="";
        this.title="Créer codes promo";
        this.buttonName="Créer";
        this.createOrUpdate=1;
        this.idcodePromo=null;
        this.dateDeb='';
        this.dateFin=null;
        this.code=null;
        this.typePromo=null;
        this.valeur=null;
        this.statut = true;
        this.resetOffre();
        this.childModalCree.show();
    }

    public onDeleteCancel(){
        this.errorMessage="";
        this.idcodePromo=null;
        this.dateDeb='';
        this.dateFin=null;
        this.code=null;
        this.typePromo=null;
        this.statut = true;
        this.resetOffre();
        this.childModalCree.hide();
    }

    public createOrUpdateCode(form:FormGroup){
        if(form.valid) {
            this.offres.forEach(data=>{
                data.checked && this.offresId.push(data.id);
            })
            let dataToSend = {
                "dateDeb" :this.dateDeb,
                "dateFin" :this.dateFin,
                "code":this.code,
                "typePromo":this.typePromo,
                "valeur":this.valeur,
                "idOffres":this.offresId,
                "actif" :this.statut,
                "idcodePromo": this.idcodePromo
            }
            this.homeApplicatifServiceACI.addOrUpdateCodesPromo(dataToSend).subscribe(res => {
                this.onChangeTable(this.config);
                this.errorMessage="";
                this.childModalCree.hide();
            });
        }
        else{
            this.errorMessage = "Veuillez remplir tous les champs"
        }
    }

}
