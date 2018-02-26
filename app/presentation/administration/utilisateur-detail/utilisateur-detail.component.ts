import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';
import { TchatModalComponent } from '../tchat-modal/tchat-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../commun/shared-service';



import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { UtilisateurApplicatifServiceACI } from '../../../service/applicatif/utilisateur';
import {StatutModerationDo} from '../../../donnee/statut/statut-moderation-do';
import { CryptionAesService } from '../../../commun/cryption-aes.service';

import { AuthenticationApplicatifServiceACI } from '../../../service/applicatif/authentication';


@Component({
  selector: 'app-utilisateur-detail',
  templateUrl: './utilisateur-detail.component.html',
  styleUrls: ['./utilisateur-detail.component.css']
})

export class UtilisateurDetailComponent implements OnInit {
  uid: string;
  public userDetail?: any;
  statusModeration: StatutModerationDo[];
  itemSelected: string;
  public informationMessage : string = '';
  hasError : boolean = false;
  public statutActivate: number;
  public labelAcivate: string;
  //translation
  ResetPasswordLink : string;
  wrongMailOrPassword : string;
   userNotFoundLdap: string;
  connectionLdapFailed: string;
  passwordInvalid: string;
  codeConfirmationInvalid: string;
  adressEmailInvalid: string;
  dataInvalid: string;
  inputEmpty: string;
  notResult: string;
  resetPasswordFailed: string;
  userNotFound: string;
  mailSucces: string;
  timeOutConfirmation: string;

  alertCssClass: string;
  userDetailId: string;
  ctJid: string;
  isLoading:boolean=false;

    constructor(
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private translate: TranslateService,
        private modalService: BsModalService,
        private router: Router,
        private cryptionAesService: CryptionAesService,
        public authenticationApplicatifService: AuthenticationApplicatifServiceACI,
        public administrationApplicatifServiceACI: AdministrationApplicatifServiceACI,
        public utilisateurApplicatifServiceACI: UtilisateurApplicatifServiceACI,
        private route: ActivatedRoute,
        private bsModalRef: BsModalRef,
        private activatedRoute: ActivatedRoute,
        public sharedService: SharedService
    ) { }

  ngOnInit() {
      this.isLoading=true;
      this.alertCssClass = 'info';
      this.initTranslation();
      this.utilisateurApplicatifServiceACI.getStatutModeration().subscribe(STATUT => {
        this.statusModeration = STATUT;
      });

      this.uid = this.route.snapshot.params['id'];
      this.homeApplicatifServiceACI.getUserDetail(this.uid).subscribe(userDetail => {
      this.userDetail = userDetail;

      this.ctJid = this.userDetail.id + '@' + environment.openfireServer;
      let encryptedctJid = this.cryptionAesService.cryptMessage( this.ctJid );
      sessionStorage.setItem('ctJid', encryptedctJid.toString());


      let contactJid = sessionStorage.getItem('ctJid');
      let decryptedjid = this.cryptionAesService.decryptMessage(contactJid);
      console.log('DSCRYPT , ', decryptedjid);

      if (userDetail.isActive === 1) {
        this.labelAcivate = 'Activer';
        this.statutActivate = 305;
      }else if (userDetail.statutCompte === 1) {
          this.labelAcivate = 'Reprendre';
          this.statutActivate = userDetail.statutCompte;
      }else{
        this.labelAcivate = 'Suspendre';
        this.statutActivate = userDetail.statutCompte;
      }
      this.itemSelected = this.userDetail.uidStatutModeration;
      this.isLoading=false;
    });
    this.userDetailId = this.uid;
  }

  showTchatModal(): void {
      this.bsModalRef = this.modalService.show(TchatModalComponent);
      this.sharedService.tchatData.next({userDetailId: this.userDetailId});
      var modalComponent = this.bsModalRef.content as TchatModalComponent;
      let data = {
          'title': 'Confirmation suppression',
          'content': 'Voulez-vous vraiment supprimer cette image? ',
          'uid': this.userDetailId,
          'ctJid': this.ctJid,
          'pseudo': this.userDetail.pseudo
      }

      modalComponent.model = data;
      modalComponent.afterModelLoad();
      modalComponent.out.subscribe((result) => {

      });
  }

  goToList(): void{
    this.router.navigate(['/administration/utilisateurs']);
  }

  translateString (initString: string) : string {
      switch (initString) {
          case 'ActivationLink':
              return this.ResetPasswordLink;
          case 'userNotFoundLdap':
              return this.userNotFoundLdap;
          case 'connectionLdapFailed':
              return this.connectionLdapFailed;
          case 'passwordInvalid':
              return this.passwordInvalid;
          case 'codeConfirmationInvalid':
              return this.codeConfirmationInvalid;
          case 'adressEmailInvalid':
              return this.adressEmailInvalid;
          case 'DataInvalid':
              return this.dataInvalid;
          case 'inputEmpty':
              return this.inputEmpty;
          case 'notResult':
              return this.notResult;
          case 'resetPasswordFailed':
              return this.resetPasswordFailed;
          case 'userNotFound':
              return this.userNotFound;
          case 'mailSucces':
              return this.mailSucces;
          case 'timeOutConfirmation':
              return this.timeOutConfirmation;
          default:
              return this.dataInvalid;
        }
  }

  initTranslation (){
    this.translate.get('ResetPasswordLink').subscribe((res: string) => {
      this.ResetPasswordLink = res;
    });
    //
    this.translate.get('WrongMailOrPassword').subscribe((res: string) => {
      this.wrongMailOrPassword = res;
    });

    this.translate.get('userNotFoundLdap').subscribe((res: string) => {
      this.userNotFoundLdap = res;
    });
    this.translate.get('connectionLdapFailed').subscribe((res: string) => {
      this.connectionLdapFailed = res;
    });
    this.translate.get('passwordInvalid').subscribe((res: string) => {
      this.passwordInvalid = res;
    });
    this.translate.get('codeConfirmationInvalid').subscribe((res: string) => {
      this.codeConfirmationInvalid = res;
    });
    this.translate.get('adressEmailInvalid').subscribe((res: string) => {
      this.adressEmailInvalid = res;
    });
    this.translate.get('DataInvalid').subscribe((res: string) => {
      this.dataInvalid = res;
    });
    this.translate.get('inputEmpty').subscribe((res: string) => {
      this.inputEmpty = res;
    });
    this.translate.get('notResult').subscribe((res: string) => {
      this.notResult = res;
    });
    this.translate.get('resetPasswordFailed').subscribe((res: string) => {
      this.resetPasswordFailed = res;
    });
    this.translate.get('userNotFound').subscribe((res: string) => {
      this.userNotFound = res;
    });
    this.translate.get('mailSucces').subscribe((res: string) => {
      this.mailSucces = res;
    });
    this.translate.get('timeOutConfirmation').subscribe((res: string) => {
      this.timeOutConfirmation = res;
    });

  }

  resetPassword() {
    this.alertCssClass = 'info';

    if (!this.authenticationApplicatifService.loggedIn())
    {
      this.router.navigate(['/login']);
    }
    else{
      if (this.userDetail && this.userDetail.pseudo){
        //this.userDetail.idSite = 4;
        this.authenticationApplicatifService.resetPassword (this.userDetail.pseudo, this.userDetail.idSite )
        .subscribe(res => {

          if (res.status === 200)
          {
            this.informationMessage = 'Réinitialisation du mot de passe avec succès';
          }
          else {
            this.hasError = true;
            this.alertCssClass = 'danger';
            if (res.error instanceof Array) {
              if (res.error[0]){
                //console.log(res.error[0]);
                  this.informationMessage = this.translateString(res.error[0]);

              }
              else{
                this.informationMessage = this.dataInvalid;
              }
            }
            else
            {
              this.informationMessage = this.dataInvalid;
            }
          }
        },
          err => {
            this.hasError = true;
            this.alertCssClass = 'danger';
              this.informationMessage = this.wrongMailOrPassword;
        });

      }
    }
  }
userRejectPseudo(): void{
    this.authenticationApplicatifService.resetPseudoOrMail(this.uid, false)
        .subscribe(res => {
          if (res.status === 200){
            this.informationMessage = 'Rejet de pseudo avec succes';
          }else{
            this.hasError = true;
          }
        },
          err => {
            this.hasError = true;
            this.alertCssClass = 'danger';
            this.informationMessage = 'Une erreur se reproduit';
      });
  }

  userRejectMail(): void{
      this.authenticationApplicatifService.resetPseudoOrMail(this.uid, true)
        .subscribe(res => {
          if (res.status === 200){
            this.informationMessage = 'Rejet de mail avec succès';
          }else{
            this.hasError = true;
          }
        },
          err => {
            this.hasError = true;
            this.alertCssClass = 'danger';
            this.informationMessage = 'Une erreur se reproduit';
      });
  }

  updateUserStatutModerisation(itemSelected): void{
      this.utilisateurApplicatifServiceACI.updateUserStatutModerisation(this.uid, itemSelected)
      .subscribe(res => {
          if (res.status === 200){
            this.informationMessage = 'Modification statut moderation avec succès';
          }else{
            this.hasError = true;
          }
        },
          err => {
            this.hasError = true;
            this.alertCssClass = 'danger';
            this.informationMessage = 'Une erreur se reproduit';
      });
  }

  DesactiveUsers(): void{
    if (this.statutActivate === 305){
      this.utilisateurApplicatifServiceACI.activeUsers(this.uid)
                    .subscribe(res => {
                        if (res.status === 200){
                            this.statutActivate = 0;
                            this.informationMessage = 'Activation avec succès';
                            this.labelAcivate = 'Suspendre';
                        }else{
                           this.hasError = true;
                        }
                         },
            err => {
              this.hasError = true;
              this.alertCssClass = 'danger';
              this.informationMessage = 'Une erreur se reproduit';
        })
      }else{
          this.utilisateurApplicatifServiceACI.desactiveUsers(this.uid, this.statutActivate)
            .subscribe(res => {

                if (res.status === 200){
                  if (this.statutActivate === 1){
                    this.statutActivate = 0;
                    this.informationMessage = 'Activation avec succès';
                    this.labelAcivate = 'Suspendre';
                  }else{
                    this.statutActivate = 1;
                    this.informationMessage = 'Suspension avec succès';
                    this.labelAcivate = 'Reprendre';
                  }
                }else{
                  this.hasError = true;
                }
              },
                err => {
                  this.hasError = true;
                  this.alertCssClass = 'danger';
                  this.informationMessage = 'Une erreur se reproduit';
            });
        }
  }
    delete() : void{
        let args = {'uid': this.uid}
        this.administrationApplicatifServiceACI.deleteUser(args).subscribe(users => {
            this.router.navigate(['/administration/utilisateurs'])

        } , err => {
            console.log(err)
        });
    }

}
