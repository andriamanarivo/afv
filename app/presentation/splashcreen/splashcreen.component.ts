
import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedDataService } from '../../presentation/shared/service/shared-data.service';
import { SharedService } from '../../commun/shared-service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-splashcreen',
  templateUrl: './splashcreen.component.html',
  styleUrls: ['./splashcreen.component.css']
})
export class SplashcreenComponent implements OnInit {
  confirmInscriptionHasError = false;
  confirmInscriptionMessage: String;
  errorMessage= '';
  year;
  isLoading = false;
  public show = false;
  current= 'one';


  resetpasswordHasError = false;
  resetpasswordMessage: String;
  constructor(
    private sharedDataService: SharedDataService,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
    ) {
      const confirmCookie =  localStorage.getItem('confirmCookie');
      this.show = !(confirmCookie && confirmCookie === '1');
    }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.isLoading = false;
    this.sharedDataService.inscriptionConfirm.subscribe(inscription => {
        this.confirmInscriptionHasError = inscription.hasError;
        this.confirmInscriptionMessage = inscription.message;
        // console.log("hasError",inscription.hasError);
        // console.log("message",inscription.message);
      });

    this.sharedDataService.resetPassword.subscribe(password => {
        this.resetpasswordHasError = password.hasError;
        this.resetpasswordMessage = password.message;
        // console.log("hasError",password.hasError);
        // console.log("message",password.message);
      });

    //   this.sharedService.getOpenfireError.subscribe(error => {
    //     if (error && error > 0) {
    //       this.confirmInscriptionHasError = true;
    //       switch (error) {
    //         case 404:
    //           this.confirmInscriptionMessage = 'Vous êtes déconnecté du serveur de messagerie.';
    //             break;
    //         case 400:
    //           this.confirmInscriptionMessage = 'le serveur de messagerie n\' est pas accessible.';
    //             break;
    //         default:
    //           this.confirmInscriptionMessage = 'le serveur de messagerie n\' est pas accessible.';
    //           break;
    //       }
    //       this.sharedService.setOpenfireError = 0;
    //     }
    //   });
    const sub = this.route
      .queryParams
      .subscribe(params => {
          if (params.alreadyConnected) {
              this.translate.get('ALREADY_CONNECTED').subscribe((res: string) => {
                  this.errorMessage  = res;
              });
          }
      });
  }

  public onSubmit() {
    this.isLoading = true;
    this.sharedDataService.clearprocessinscriptionsteps();
    this.sharedDataService.setEtapeInscription(1);
    this.router.navigate(['/inscription/Vousetes']);
  }

  acceptCookies(): void {
    /* this.sharedService.confirmCookie.next(false); */
    localStorage.setItem('confirmCookie', '1');
    this.show = false;
  }
  goToAbout(): void {
    this.router.navigate(['/confidentiality']);
  }

}
