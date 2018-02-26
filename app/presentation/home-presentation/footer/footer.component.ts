import { Component, OnInit, Input } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import {ActivatedRoute} from '@angular/router';
import { Utilisateur } from '../../../donnee/home/utilisateur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig }       from '../../../contrainte/config/_app/app.config';
 import { Router, CanActivate } from '@angular/router';
 import { RouterLink } from '@angular/router';
 import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
 import { SharedService } from '../../../commun/shared-service';
 import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class footerComponent implements OnInit {
  public userConnecte?: any;
  baseUrl: string;
  nbFavoris: number;
  nbMessages: number = 0
  nbVisiteur: number = 0
  constructor(
    private appConfig :AppConfig,
    public sharedService: SharedService,
    private sharedDataService : SharedDataService,
     private authApplicatifService: AuthenticationApplicatifService
  ) {
      this.baseUrl = this.appConfig.getConfig("baseUrlAppUrl");
      this.baseUrl = this.baseUrl.replace("app_dev.php/",""); 
   }
  
   ngOnInit() {
        this.sharedDataService.userConnected.subscribe(user => {
          this.userConnecte = user;
          //console.log(this.userConnecte );
        });
        this.sharedService.favoris$.subscribe(p => {
             this.nbFavoris = p;
        });
        this.sharedService.visiteur$.subscribe(a=>{
            this.nbVisiteur = a;
        });
        this.getNbMessages();
  }
   getNbMessages(): void {
       let isLogged = this.authApplicatifService.islogged();
       this.sharedService.getTchatMessageCount.subscribe(p => {
           if (isLogged) {
               if (p)
                   this.nbMessages = p;
               else {
                   let allUnreadMessageCount = sessionStorage.getItem("allUnreadMessageCount");
                   if (allUnreadMessageCount !== undefined && allUnreadMessageCount !== null) {
                       this.nbMessages = +allUnreadMessageCount;
                   }
                   else
                       this.nbMessages = 0;
               }
           }
       });
   }


}
