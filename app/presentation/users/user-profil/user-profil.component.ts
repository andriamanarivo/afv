import { Component, OnInit } from '@angular/core';

import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { SharedService } from '../../../commun/shared-service';
import {ActivatedRoute} from '@angular/router';
import {Message as MessagePrimeNg} from 'primeng/primeng';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  constructor(
    public homeApplicatifServiceACI:HomeApplicatifServiceACI,
    private route:ActivatedRoute,
    private appConfig: AppConfig,
    public sharedService: SharedService
  ) { }
    public userDetail?: any;
    msgs: MessagePrimeNg[] = [];
    public publicPhoto: boolean = false;
    public privePhoto: boolean = false;
    public albumChoice: boolean = true;
    public nbPhoto: any = 0;
    public nbAllPhoto: any = 0;
    public prevTabIndex = 0;
    baseUrl = "";
    uid: string;
    identifiant: string;
    loading: boolean = false;
    public photos: any;
    public tendance: any;
    public photosCouv: any = [];

    public photosPub: any;
    public photosPriv: any;
    public photosPubShow: any;
    public photosPrivShow: any;
    public nbPhotoPub: any = 0;
    public nbPhotoPriv: any = 0;
    public favoris: any;
    public nbFavoris: number;

    public activeTab: number = 0;
    public nbPhotoPrivPub : any = 0;
    public allowTchat:boolean=true;

  ngOnInit() {
    // console.log("erere");
    //  this.uid = this.route.snapshot.params['id'];
    //  this.homeApplicatifServiceACI.getUserDetail(this.uid)
    //   .subscribe(userDetail=>{
    //     this.userDetail = userDetail;
    //     console.log("user detail",this.userDetail.ville);
    //   }
    // ); 
    //deb olivier new
        this.baseUrl = this.appConfig.getConfig("baseUrlAppUrl");    
        this.baseUrl = this.baseUrl.replace("app_dev.php/","");  
        this.route.params.subscribe(params => {            
            //this.activeTab = params["to"] === "photos" ? 1 : 0;
             switch(params["to"]) {
                
                case "photos":        
                    this.activeTab =  1;
                    break;        
                case "messages":        
                    this.activeTab =  3;
                    break;
                default:
                    this.activeTab =  0;
            }
        });

       // this.uid = this.route.snapshot.params['id'];
        this.route.params.subscribe(params => {
            this.uid = params["id"];

            this.homeApplicatifServiceACI.getUserDetail(this.uid).subscribe(userDetail => {
                console.log(userDetail);
                // if(!userDetail.result) {
                //     this.showWarning("Utilisateur non trouvé");
                // } else {
                //     this.userDetail = userDetail;
                //     this.tendance = this.userDetail.tendance.toLocaleLowerCase();
                // }  
                this.userDetail = userDetail;
                this.tendance = this.userDetail.tendance.toLocaleLowerCase();              
            });
            this.homeApplicatifServiceACI.listePhoto(this.uid, "PUBLIC").subscribe(photos => {
                if (photos[0])
                    this.photosPubShow = photos[0].uri;
                let data = [];
                data = data.concat(photos);
                this.nbAllPhoto = photos.length;
                this.photosPub = photos;
                this.nbPhotoPub = photos.length;
                this.photosCouv = data.splice(0, 6);
                this.nbPhotoPrivPub = this.nbPhotoPub + this.nbPhotoPriv;
            });
            this.homeApplicatifServiceACI.listePhoto(this.uid, "PRIVATE").subscribe(photos => {
                if (photos[0])
                    this.photosPrivShow = photos[0].uri;
                this.photosPriv = photos;
                this.nbPhotoPriv = photos.length;
                this.nbAllPhoto = this.nbAllPhoto + photos.length;
                this.nbPhotoPrivPub = this.nbPhotoPub + this.nbPhotoPriv;

            });
            this.homeApplicatifServiceACI.listeFavoris(this.uid, 0, 10).subscribe(favoris => {
                this.sharedService.listeFavoris = favoris.value;

            });

        });
        this.sharedService.listeFavoris$.subscribe(p => {
            this.favoris = p;
            this.nbFavoris = (this.favoris).length;
        });
    // fin
  }


  selectTab(event) {      
        if (event.index !== 3) {
            this.prevTabIndex = event.index;
        } else if(this.userDetail) {
            //Verifier si parmis les blacklist pour desactiver tchat
            this.homeApplicatifServiceACI.checkinBlackList(this.userDetail.pseudo)
                .subscribe(res => {
                    console.log(res);
                    if (res.isBlackList === "true") {
                        //this.showWarning("Vous ne pouvez pas tchater avec cet utilisateur.  Il est dans votre liste noire, ou vous êtes dans la sienne.");
                       this.activeTab = 0;
                       this.allowTchat = false;
                    }
                }, err => {
                    this.errorCallBack(err);
                });
        }
    }

    showWarning(err) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "", detail: err });
    }

    private errorCallBack(err): void{
        //TODO SHOW ERROR IN POPUP
        console.log(err);
    }
    public showPublic() {
        this.publicPhoto = true;
        this.privePhoto = false;
        this.albumChoice = false;
        this.photos = this.photosPub;
        this.nbPhoto = this.nbPhotoPub
       
    }

    public showPrive() {
        this.publicPhoto = false;
        this.privePhoto = true;
        this.albumChoice = false;
        this.photos = this.photosPriv
        this.nbPhoto = this.nbPhotoPriv
        
    }

    public album() {
        this.photos = [];
        this.nbPhoto = 0;
        this.publicPhoto = false;
        this.privePhoto = false;
        this.albumChoice = true;
    }


    setFavoris(fav) {
       for (var i in fav) {
           fav[i].favoris = true;
       }
   }

}
