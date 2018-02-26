import { Component, OnInit,AfterViewInit,ViewChild,Input  } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { Home } from '../../../donnee/home/home';
import { Router, CanActivate } from '@angular/router';
import { PagerService } from '../../../service/pager.service';
import {SharedService} from '../../../commun/shared-service';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { PhotoPdp } from '../../../commun/photo.pdp';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements OnInit {
    @Input() set dataSend(data: any) {
        let order = "";
        if(data.order){
            order = data.order;
            delete data.order;
        }


        this.onUpdate(data,order);
    };
    
  msgs: MessagePrimeNg[] = [];
  p: number = 1;
  public order : string ="firstName";
  desc = 0;
  size: number =4;
  identifiant: string;
  public homes?: any;
  public baseUrl : String;
  constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
  private pagerService: PagerService,
  private photoPdp : PhotoPdp,
  private router: Router,

   public sharedService: SharedService,
   private appConfig : AppConfig
  ) { }
    color = 'primary';

    public progresValue: number = 50;
    bufferValue = 75;

     @ViewChild('content') content: any;
    public showContents : boolean = false;
    private allItems: any[];
    public isFiltre: boolean = false;
    public pratiques : any =   [];
    public tendances : any =   [];
    public recherches : any =[];
    public data : any ={};
    public dataFiltre : any ={};
    public recherche : any ={};

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    totalItems: number;
    loading: boolean = false;
    foods = [
        {value: '0', viewValue: 'Km'},
        {value: '1', viewValue: 'En ligne'},
        {value: '2', viewValue: 'A-Z'},
        {value: '3', viewValue: 'Age'},
        {value: '4', viewValue: 'S / D / SW'}
    ];
    selectedValue: string = this.foods[0].value;
    ngOnInit() {
        this.baseUrl = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrl = this.baseUrl.replace("app_dev.php/","");
        this.data = {
            "uidSearch":"",
            "ageMax":null,
            "ageMin" :null,
            "rencontre":"",
            "localisation":"",
            "tendances":"",
            "pratiques":["","",""],
            "isConnected": null,
            "isDefault":null,
            "avecPhoto":null,
            "libelle":""
        }
        //this.initRecherche();
    }

    goToTchat(user): void {
        //Verifier si parmis les blacklist pour desactiver tchat
        this.homeApplicatifServiceACI.checkinBlackList(user.firstName)
            .subscribe(res => {
                if (res.isBlackList === true || res.isUserAddBlackList) {
                   // tslint:disable-next-line:max-line-length
                   let errorMessage = res.isUserAddBlackList ? "Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire." : "Vous ne pouvez plus tchater avec cet utilisateur. Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.";
                   this.errorCallback(errorMessage);
               }else {
                    this.router.navigate(['/home/profil/' + user.id + '/messages']);
                }
            }, err => {
                this.errorCallback(err);
            });
    }
    public initRecherche() {
        this.dataFiltre = this.data;
        this.homeApplicatifServiceACI.getListRecherche().subscribe(res => {
            this.recherches = res;
            res.forEach((data) => {
                if (data.isDefault) {
                    this.recherche = data;
                    this.data = data;
                    this.isFiltre = true;
                    this.dataFiltre = data;
                    this.setPage(1, this.data);
                }
            })

            if (!this.isFiltre)
                this.setPage(1, this.data);
        });
    }

    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "", detail: err });
    }
  favoris(id:string){
    this.loading = true; 
     this.identifiant = id;  
    this.homeApplicatifServiceACI.addFavoris(id).subscribe(()=>{
        this.homeApplicatifServiceACI.getHomes(1, 10).subscribe(homes => {
          this.homes = homes.value;
          this.sharedService.favoris = homes.nbFavoris;
          this.loading = false;
          this.identifiant = "";
        });
    });    
  }
  deleteFavoris(id:string)
  {
    this.loading = true;
     this.identifiant = id;
    this.homeApplicatifServiceACI.deleteFavoris(id).subscribe(()=>{
      this.homeApplicatifServiceACI.getHomes(1, 10).subscribe(homes => {
          this.homes = homes.value;
          this.sharedService.favoris = homes.nbFavoris;
          this.loading = false;
          this.identifiant = "";
        },
          err => {
              console.log(err);
          });
       
    });
  }

    public onUpdate(data,order){
        this.order = order;
        if(this.order.length === 0) this.order="firstName";
        this.data = data;
        this.setPage(1,this.data);
        this.dataFiltre = this.clone(this.data);

    }


    setPage(page: number,data) {        
        // let offset = 10 * (page - 1) + 1;  
         let offset = 12 * (page - 1) ;    
        let sortData = {order: this.order, desc:this.desc};
        this.homeApplicatifServiceACI.recherche(data, offset,12,sortData).subscribe((homes)=>{
            let homesModified = [];
            let data = homes.result;
            if (!homes.errorExist) {
                homesModified = data.value.map(user => {
                    if (!user.photo) {
                        if (user.idVsEtes !== null) {
                            const profilePhoto = this.photoPdp.getPhotoPdp(user.idVsEtes);
                            if (profilePhoto) {
                                user.defaultpdp = profilePhoto.pdp;
                            } else {
                                user.defaultpdp = 'assets/img/profil-default.png';
                            }
                        } else {
                            user.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }
                    return user;
                });
            }
            this.homes = homesModified;
            if(data.nbResults){
                this.totalItems = data.nbResults;
                this.allItems = data.value;
            }

            else{
                this.totalItems = 0;
                this.allItems = [];
            }
            //  this.sharedService.favoris = homes.nbFavoris;
            //  this.nbFavoris = homes.nbFavoris;
             
             //pagination
             if (page < 1 || page > this.pager.totalPages) {
             return;
             }
             // get pager object from service
             this.pager = this.pagerService.getPager(this.totalItems, page, 12);
             // get current page of items
             this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

            //fin pagination
        });
        // this.getNbFavoris();
    }

    public clone(obj){
        try{
            var copy = JSON.parse(JSON.stringify(obj));
        } catch(ex){
            alert("erreur");
        }
        return copy;
    }

}
