import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../contrainte/rule/validation.service';
declare const $;

@Component({
    selector: 'app-souscription',
    templateUrl: './souscription.component.html',
    styleUrls: ['./souscription.component.css']
})
export class SouscriptionComponent implements OnInit {
     public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public souscriptions;
    public unescapeHtmlChar: any = {
        '&#39;': '\'',
        '&amp;': '&',
        '&apos;': '\'',
        '&gt;': '>',
        '&lt;': '<',
        '&quot;': '"',
    };
    public payForm: any;
    click : boolean = false;
    public validator : any ={ "numValide" : false,"dateValide" : false,"ccvValide" : false}
    data = {porteur: '', dateval: '', cvv: ''};

    public date : any;
    public souscris : boolean = false;
    public ccvv : any;
    public currentSouscription: any;
    public offre : any;
    action: string = "Résilier";
    loading: boolean = false;
    resulier:boolean=true;
    loadDataSouscription: boolean = false;
    currentSouscriptionId: string = "";
    currentUser: any;
    dureeUnitData = {Y:"an(s)"};
    public dataRoles :any;
    val1: number;
    codePromo="";
    erreurMessage="";
    codeUse=[];
    constructor(
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private jwtHelper: JwtHelper,
        private formBuilder: FormBuilder,
        private router : Router) {
            /* this.val1 = 9165551234; */
       }

    ngOnInit() {
        var token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);
        this.getSouscriptionDatas(false);
        this.payForm = new FormGroup({
            'porteur': new FormControl(this.data.porteur, [
                Validators.required,
                ValidationService.creditCardValidator// <-- Here's how you pass in the custom validator.
            ]),
            'dateval': new FormControl(this.data.dateval, [
                Validators.required,
                ValidationService.dateValValidator
            ]),
            'cvv': new FormControl(this.data.cvv, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(4) // <-- Here's how you pass in the custom validator.
            ]),
        });

    }
    get porteur() { return this.payForm.get('porteur'); }
    get dateval() { return this.payForm.get('dateval'); }
    get cvv() { return this.payForm.get('cvv'); }
    hasSouscription = false;
    getSouscriptionDatas(resilier): void {
        this.loadDataSouscription = true;
        let uid = this.currentUser.uid;
        this.homeApplicatifServiceACI.getCurrentSouscription(uid)
            .subscribe(
                res => {
                    if (res.status !== "NO_SOUSCRIPTION") {
                        this.souscris = true;
                        this.hasSouscription = true;
                        this.gestionDaffichageSouscripActif(res.souscription,resilier);
                        this.getOffres();
                    }else {
                        this.souscris = true;
                        this.resulier = false;
                        this.gestionDaffichageSouscripActif(res.souscription,resilier);
                        this.getOffres();
                    }
                   
                    this.loadDataSouscription = false;


                },
                err => {
                    console.log(err);
                    this.loadDataSouscription = false;
                });
    }
    back():void{
        this.router.navigate(['/home/modifProfil/1']);

    }

    public  unescape(string) {
        let _str = '';
        const  reEscapedHtml  = /&(?:amp|lt|gt|quot|#39|apos|eacute|ecirc);/g;
        const unescapeHtmlChar = this.basePropertyOf(this.unescapeHtmlChar);
        const reHasEscapedHtml  = RegExp(reEscapedHtml.source);
        if (string) {
            _str = string;
        }
        string = _str.toString();
        return (string && reHasEscapedHtml.test(string))
            ? string.replace(reEscapedHtml, unescapeHtmlChar)
            : string;
    }

    public basePropertyOf(object) {
        return function(key) {
            return object == null ? undefined : object[key];
        };
    }
    doAction(dataSouscription): void {
        this.loading = true;
        if (this.currentSouscription.statut.toLowerCase() === "actif") {
            let data = {
                offreId: dataSouscription.offreId,
                uid: this.currentUser.uid
             }
           this.resilierSouscription(data);
        } 
    }
    resilierSouscription(data: any): void {
        this.homeApplicatifServiceACI.resilierSouscription(data).subscribe(
            res => {
                console.log(res);
                this.loading = false;
                this.loadDataSouscription = false;
                if (res.status === "SOUSCRIPTION_RESILIE") {
                    this.souscris = true;
                    this.resulier=false;
                    this.getSouscriptionDatas(true);
                } else {
                    console.log("ERROR");
                }
            },
            err => {
                this.loading = false;
                this.loadDataSouscription = false;
                console.log(err);
            });
    }
    renouvelerSouscription(): void {
        console.log("renouveler");
        /*let data = {
            offreId: this.currentSouscription.id,
            souscriptionId: this.currentSouscription.id,
            uid: this.currentUser.uid
        }
        this.homeApplicatifServiceACI.renouvelerSouscription(data).subscribe(
            res => {
                this.loading = false;
                this.loadDataSouscription = false;
                this.currentSouscription = null;
                console.log(res);
                this.souscris = false;
            },
            err => {
                console.log(err);
                this.loading = false;
                this.loadDataSouscription = false;
            });*/
    }
    getOffres(): void {
        this.homeApplicatifServiceACI.getOffres("").subscribe(res => {
            let offres  = res.results;
            for(let i=0 ;i < offres.length;i++){
                if(offres[+i].periodeId==1){
                    offres[+i].periodeId='h';
                }
                if(offres[+i].periodeId==2){
                    offres[+i].periodeId='jour';
                }
                if(offres[+i].periodeId==3){
                    offres[+i].periodeId='mois';
                }
                if(offres[+i].periodeId==4){
                    offres[+i].periodeId='ans';
                }
                if(offres[+i].iSonepay){
                    offres[+i].prixPay=offres[+i].prix*offres[+i].duree;
                }else{
                    offres[+i].prixPay=offres[+i].prix;
                }
                offres[+i].conditionBlack="";
                offres[+i].conditionRed="";
                if(offres[+i].conditionPaiment!==null){
                    offres[+i].conditionBlack=offres[+i].conditionPaiment;
                    if( offres[+i].conditionPaiment.indexOf('%') >= 0){
                        let index=offres[+i].conditionPaiment.indexOf( "%" );
                        offres[+i].conditionBlack=offres[+i].conditionPaiment.substr(0,index-3);;
                        offres[+i].conditionRed=offres[+i].conditionPaiment.substr(index-3);
                    }
                }
            }
            this.souscriptions = offres;
            this.loadDataSouscription = false;
        },
        err=>{
            this.loadDataSouscription = false;
            console.log("ERROR");
        });
    }
    subscribeToOffer(): void {
        this.click = true;
        if(this.payForm.valid){
            this.click = false;
            // if(this.souscris&&this.resulier)
            //     alert("vous avez déjà souscrit à une offre Premium");
            // else{
            this.loadDataSouscription = true;

            let data = this.payForm.value;
            data.dateval = data.dateval.substring(0,2)+data.dateval.substring(3,5);
            let montant = this.offre.prix;
            if(this.offre.iSonepay){
                montant = this.offre.prixPay;
            }
            // if(montant-Math.trunc(montant) == 0)
            //     montant = Math.trunc(montant)+"00"
            // else
            //     montant = Math.trunc(montant)+""+(montant-Math.trunc(montant))*100;
             data.porteur =data.porteur.replace(/ /g,"");
            data.montant =montant;
            this.homeApplicatifServiceACI.addOrVerifyPayment(data).subscribe(res => {
                if(JSON.parse(res.content).hasError == "00000"){
                    let souscriptionInfos = {
                        offreId: this.offre.id,
                        uid: this.currentUser.uid,
                        cbId:JSON.parse(res.content).data
                    };
                    this.currentSouscriptionId =this.offre.id;
                    this.loading = true;
                    this.homeApplicatifServiceACI.subscribeToOffer(souscriptionInfos).subscribe(
                        res => {
                            this.loading = false;
                            this.loadDataSouscription  = false;
                            if (res.status === "SOUSCRIPTION_OK") {
                                this.souscris = true;
                                this.currentSouscription = res.souscription;
                                this.formatDates();
                                this.resulier = true;
                                this.souscris = false;
                                this.getSouscriptionDatas(false);
                                this.currentSouscription.dureeUnit = this.dureeUnitData[this.currentSouscription.dureeUnit];
                                this.initChampcarte();
                                if(this.currentUser.roles.indexOf('ABONNE FEMME')===-1||this.currentUser.roles.indexOf('ABONNE HOMME')===-1){
                                   this.addDataRolesAbonne();
                                }
                            } else {
                                this.initChampcarte();
                                console.log("ERROR");
                            }
                        },
                        err => {
                            console.log(err);
                            this.loading = false;
                            this.loadDataSouscription = false;
                        });

                }
                else{
                    this.loadDataSouscription = false;
                    this.initChampcarte();
                     console.log(JSON.parse(res.content).message);
                     console.log(this.unescape(JSON.parse(res.content).message));
                    window.alert(this.unescape(JSON.parse(res.content).message));
                }
            },err=>{
                this.loadDataSouscription = false;
                this.initChampcarte();
                console.log("ERROR souscription call ws");
            });
            //}

        }
    }
    formatData(souscriptions) {
        let newArray = [];
        for (let i = 0; i < souscriptions.length; i = i + 2) {
            let row = [];
            for (let j = 0; j < 2; j++) {
                let item = souscriptions[i + j];
                if (!item) break;
                row.push(item);
            }
            newArray.push(row);
        }
        this.souscriptions = newArray;
    }

    formatDates(): void{
        if(this.currentSouscription.dateSouscription){
            this.currentSouscription.dateSouscription = this.currentSouscription.dateSouscription.split("-")[2]+"/"+this.currentSouscription.dateSouscription.split("-")[1]+"/"+this.currentSouscription.dateSouscription.split("-")[0];
        }
        if(this.currentSouscription.dateExpiration){
            this.currentSouscription.dateExpiration = this.currentSouscription.dateExpiration.split("-")[2]+"/"+this.currentSouscription.dateExpiration.split("-")[1]+"/"+this.currentSouscription.dateExpiration.split("-")[0];
        }
    }

    gestionDaffichageSouscripActif(currentSouscription,resilier){
        if(currentSouscription){
            for (let inscription of currentSouscription){
                if(inscription.statut=='ACTIF'){
                    this.currentSouscription = inscription;
                    this.resulier = true;
                    this.souscris = false;
                    break;
                }else if(inscription.statut=='RESILIE'){
                    this.currentSouscription = inscription;
                    this.resulier = false;
                    this.souscris = true;
                }else if(inscription.statut=='SUSPENDU'){
                    this.currentSouscription = inscription;
                    this.souscris = false;
                    this.resulier = false;
                }
            }
            if(this.currentSouscription.statut=='RESILIE'&&resilier){
                this.updateRoleAbonne();
            }
            console.log('roles',this.currentUser.roles);
            if(this.currentSouscription.dureeUnit != undefined){
                this.currentSouscription.dureeUnit = this.dureeUnitData[this.currentSouscription.dureeUnit];
                this.formatDates();
            }
        }else{
            this.loading=false;
        }
        
    }

    initChampcarte(){
        this.payForm.reset({
                'porteur': '',
                'dateval': '',
                'cvv': ''
                });
    }

    addDataRolesAbonne(){
        let roles;
        if (this.currentUser.roles.indexOf('VISITEUR FEMME') !== -1) {
            roles=['ABONNE FEMME'];
        }else{
            roles=['ABONNE HOMME'];
        }
        let dataRoles={
        "uid": this.currentUser.uid,
        "roles": roles
        };
        this.addDeleteRoleAbonne(dataRoles);
    }

    updateRoleAbonne(){
        let roles;
        if (this.currentUser.roles.indexOf('ABONNE FEMME') !== -1) {
           roles=['VISITEUR FEMME'];
        }else{
            roles=['VISITEUR HOMME'];
        }
        
        let dataRoles={
        "uid": this.currentUser.uid,
        "roles": roles
        };
        this.addDeleteRoleAbonne(dataRoles);
    }

    addDeleteRoleAbonne(dataRoles){
        this.homeApplicatifServiceACI.addDeleteRoleAbonne(dataRoles).subscribe(
            res => {
               
            },
            err => {
                console.log(err);
        });
    }

    scroll() {
        if(window.screen.width <= 1024){
            let windowh: number=$(window).height()-50;
            let documenth: number=$(document).height();
            $("html, body").animate({ scrollTop: documenth-windowh });
        }
    }

    recalculer() {
        if(this.codePromo.length>0){
            this.erreurMessage = "";
            this.homeApplicatifServiceACI.getDetailCodesPromo({code:this.codePromo}).subscribe(data=>{
                if(data.status == "404") this.erreurMessage = "Code inexistant";
                else this.calculate(data);
            },err=>{
                this.erreurMessage = "erreur serveur";
            });
        }
    }
    calculate(data){
        let use = false;
        this.codeUse.forEach(code=>{if(code == data.idcodePromo) use =true;});
        if(use) this.erreurMessage= "code déja utililisé";
        else{
            this.codeUse.push(data.idcodePromo);
            let date=new Date();
            let dateDeb=new Date(data.dateDeb);
            let dateFin=new Date(data.dateFin);

            if(date<dateDeb || date>dateFin){
                this.erreurMessage = "Code périmé";
            }
            else{
                if(data.actif){
                    data.idOffres.forEach(data1=>{
                        this.souscriptions.forEach(data2=>{
                            if(data1 == data2.id){
                                if(data.typePromo =="0") {
                                    data2.prix=data2.prix-(data2.prix*0.2);
                                    data2.prixPay=data2.prixPay-(data2.prixPay*0.2);
                                }
                                else{
                                    data2.prix=data2.prix-(data.valeur/data2.duree);
                                    if (  data.valeur % data2.duree  !== 0 )
                                        data2.prix= data2.prix.toFixed(2);
                                    data2.prixPay=data2.prixPay-data.valeur;
                                }
                            }
                        });
                    });
                }
            }
        }
    }
}
