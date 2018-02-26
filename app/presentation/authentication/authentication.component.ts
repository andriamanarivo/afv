import { Component, OnInit, ViewChild } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

// import { User } from '../../donnee/user/user';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../contrainte/rule/validation.service';

import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { AuthenticationApplicatifServiceACI
 } from '../../service/applicatif/authentication';

 import { Router, CanActivate, ActivatedRoute } from '@angular/router';
 import { ReCaptchaComponent } from 'angular2-recaptcha';

 import { AppConfig } from '../../contrainte/config/_app/app.config';
import { SharedDataService } from '../../presentation/shared/service/shared-data.service';

import { CryptionAesService } from '../../commun/cryption-aes.service';
import { SharedService } from '../../commun/shared-service';
import { HomeApplicatifService } from '../../service/applicatif/home';
import { InscriptionApplicatifServiceACI } from '../../service/applicatif/inscription/inscription.applicatif.service.aci';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StorageManagementSupport } from '../../commun/storage.management';

 // import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  loginForm: any;

  isValideCpatcha = true;

  public errorCount: number;

  public controlName: object = null;
  // user: User = new User();
  // emailControlName : string = "email";
  // passwordControlName : string = "password";
  errorMessage = '';

  wrongPassword = '';
  mailNotFound = '';
  inactivatedAccount = '';
  suspendedAccount = '';
  authenticationError = '';
  resetpasswordHasError = false;
  resetpasswordMessage: String;

  // captcha
  public captchaKey = '';
  // local  captchaKey = "6LeQFykUAAAAAGtVdY4O_MNIXl2iZluf7i_j3oeP"
  // dev  captchaKey = "6LeQFykUAAAAAGtVdY4O_MNIXl2iZluf7i_j3oeP"
  // qualif  captchaKey = "6LeQFykUAAAAAGtVdY4O_MNIXl2iZluf7i_j3oeP"

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  constructor(
    public authenticationApplicatifService: AuthenticationApplicatifServiceACI,
    private cryptionAesService: CryptionAesService,
    private appConfig: AppConfig,
    private translate: TranslateService,
    private jwtHelper: JwtHelper,
    private storageManagementSupport: StorageManagementSupport,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private inscriptionService: InscriptionApplicatifServiceACI,
    public homeApplicatifService: HomeApplicatifService,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
     ) {

        this.captchaKey = this.appConfig.getConfig('captchaKey');

        this.initializeControleName();
          this.loginForm = this.formBuilder.group({
            'password': ['', Validators.required],
            'email': ['', [Validators.required, ValidationService.emailValidator]]
          });
      }


    get getloggedIn() {
      return this.authenticationApplicatifService.loggedIn();
    }
  ngOnInit() {
      this.resetpasswordMessage = '';
      this.errorMessage = '';
      this.sharedDataService.resetPassword.subscribe(password => {
          this.resetpasswordHasError = password.hasError;
          this.resetpasswordMessage = password.message;
          // console.log("hasError",password.hasError);
          // console.log("message",password.message);
      });
      const self = this;
    // reset login status
    // console.log('login ');
      // this.authenticationService.logout();
      const sub = this.route
          .queryParams
          .subscribe(params => {
              if (params.tokenExpired) {
                  this.translate.get('NO_TOKEN').subscribe((res: string) => {
                      self.errorMessage  = res;
                  });
              }
          });

      this.errorCount = 0;

      if (this.authenticationApplicatifService.loggedIn()) {
        this.router.navigate(['/home/user']);
      }
      this.translate.get('WRONG_PASSWORD').subscribe((res: string) => {
        this.wrongPassword = res;
      });
      this.translate.get('MAIL_NOT_FOUND').subscribe((res: string) => {
        this.mailNotFound = res;
      });
      this.translate.get('INACTIVATED_ACOUNT').subscribe((res: string) => {
        this.inactivatedAccount = res;
      });
      this.translate.get('AUTHENTICATION_ERROR').subscribe((res: string) => {
        this.authenticationError = res;
      });
       this.translate.get('USER_SUSPENED').subscribe((res: string) => {
        this.suspendedAccount = res;
      });

  }

  public disableInputValidation(event: Event, currentControl) {
    // console.log(currentControl.id);

      if (currentControl) {
        switch (currentControl.id) {
          case 'mailClear':
            const emailControl = this.loginForm.controls['email'];
            if (emailControl) {
              emailControl.setValue('');
            }
            break;
          case 'passwordClear':
            const passwordControl = this.loginForm.controls['password'];
            if (passwordControl) {
              passwordControl.setValue('');
            }
            break;

        }
      }



      Object.keys(this.loginForm.controls).forEach(control => {
        this.loginForm.controls[control].markAsPristine();
        this.loginForm.controls[control].markAsUntouched();
        this.loginForm.controls[control].updateValueAndValidity();
    });
      // this.loginForm.markAsPristine()
    // this.loginForm.reset();
  }

  markAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
    });
}

  public showInputValidation() {
    if (!this.loginForm.dirty || !this.loginForm.valid) {
      for (const i in this.loginForm.controls) {
        if (this.loginForm.hasOwnProperty(i)) {
          this.loginForm.controls[i].markAsTouched();
        }
      }
    }
  }

  criptLogin(login, password) {

    /* let userLogin = username.split("@")[0]; */
    const encryptedUsername = this.cryptionAesService.cryptMessage(login);
    const encryptedPassword = this.cryptionAesService.cryptMessage(password);

    sessionStorage.setItem('rfIl', encryptedUsername.toString());
    sessionStorage.setItem('rfIp', encryptedPassword.toString());
  }
  saveOpenfireUserName(userName, password) {
      switch (userName) {

        case 'mamison301':
        case 'mamison302':
        case 'mamison303':
        case 'mamison304':
        case 'mamison305':
        case 'mamison306':
        case 'mamison307':
        case 'mamison308':
        case 'mamison309':
          this.criptLogin(userName, password);
          break;
        case 'mamisonr+102@gmail.com':
          this.criptLogin('userh2', 'userh2');
          break;
        default:
        this.criptLogin('userh1', 'userh1');
      }
  }

  uncapitalizeFirstLetter(event): void {
      if (this.loginForm.controls['email'].value.length === 1) {
          this.loginForm.controls['email'].setValue(this.loginForm.controls['email'].value.toLowerCase());
      }
  }

  emailToLowerCase(): void {
      this.loginForm.controls['email'].setValue(this.loginForm.controls['email'].value.toLowerCase());
  }

  public login() {
    this.markAsTouched();

    if (this.loginForm.dirty && this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      // console.log(email,password);
      this.inscriptionService.getIp().subscribe(adress => {
        this.authenticationApplicatifService.login(email, password, adress.ip)
        .subscribe(authentication => {
          // console.log(inscription);
          // authentication.statusCode
          // authentication.token
          this.sharedService.setLogout = false;
          this.sharedService.closeAllModal.next(false);
          this.authenticationApplicatifService.logout();
          if (authentication.statusCode === 200) {
            // console.log("authe");
            if (authentication.content) {

              const storageSupport = this.storageManagementSupport.isSupported();
              console.log(storageSupport);

              const contentJson =  JSON.parse(authentication.content);              
               sessionStorage.setItem('id_token', contentJson.token);
               const currentUser = this.jwtHelper.decodeToken(contentJson.token);
               this.criptLogin(currentUser.username, password);

               this.sharedService.setChatDisconnection(false);
               // this.saveOpenfireUserName(currentUser.username,password);
            }
            const encryptedMail = this.cryptionAesService.cryptMessage(email);
            const encryptedPassword = this.cryptionAesService.cryptMessage(password);
            sessionStorage.setItem('rfMl', encryptedMail.toString());
            sessionStorage.setItem('rfPw', encryptedPassword.toString());

            this.authenticationApplicatifService.updateConnectionStatus('1').subscribe(status => {
              console.log(status);
            });

            this.sendToken();

            this.sharedService.setActivateIdle = true;

            this.homeApplicatifService.getUserConnecte().subscribe(userConnecte => {

              const encryptedUUid = this.cryptionAesService.cryptMessage(userConnecte.uid);
              sessionStorage.setItem('rfIuid', encryptedUUid.toString());
                const contentJson = JSON.parse(authentication.content);
                const currentUser = this.jwtHelper.decodeToken(contentJson.token);
                if (userConnecte.isActive === 0) {
                    if (currentUser.isFirstConnexion) {
                      this.sharedService.isFirstConnexion.next(true);
                    }
                    sessionStorage.setItem('isPseudo', 'false');
                    this.router.navigate(['/home/completeInfo']);
                } else if (userConnecte.PseudoRejet) {
                    if (currentUser.isFirstConnexion) {
                        this.sharedService.isFirstConnexion.next(true);
                    }
                    sessionStorage.setItem('isPseudo', 'true');
                    this.router.navigate(['/home/completeInfo']);
                } else {
                    console.log('currentUser.isFirstConnexion ', currentUser.isFirstConnexion);
                    if (currentUser.isFirstConnexion) {
                        this.sharedService.showAddPhotoProfilModal.next(true);
                    }
                    this.router.navigate(['/home/user']);
                }
            });
          } else {
            // console.log("err authentification", authentication.error );
            if (authentication.error instanceof Array) {
              let errorMessage = '';
              if (authentication.error[0]) {
                  switch (authentication.error[0]) {
                    case 'bad credential':
                        errorMessage = 'Identification incorrect (mail/mot de passe)';
                        break;
                    case 'Your email is not found in this site':
                        errorMessage = this.mailNotFound;
                        break;
                    case 'your compte is not yet activate':
                        errorMessage = this.inactivatedAccount;
                        break;
                    case 'WRONG_PASSWORD':
                        errorMessage = this.wrongPassword;
                        break;
                    case 'MAIL_NOT_FOUND':
                        errorMessage = this.mailNotFound;
                        break;
                    case 'INACTIVATED_ACOUNT':
                        errorMessage = this.inactivatedAccount;
                        break;
                    case 'USER_SUSPENDED':
                        errorMessage = this.suspendedAccount;
                        break;
                    default:
                        errorMessage = authentication.error[0];
                }
              }

              // bad credential
              this.errorMessage = errorMessage;
            } else {
                this.errorMessage = this.authenticationError;
            }

            // this.errorMessage = err;
            this.errorCount++;
            if (this.errorCount >= 3) {
              this.isValideCpatcha = false;
            }
          }
        },
        err => {
          this.errorCount++;
          if (this.errorCount >= 3) {
              this.isValideCpatcha = false;
            }
          const errormsg = err.exception ? err.exception : this.authenticationError;
            this.errorCallback(errormsg);
        });
      });

    }

  }

  sendToken(){
    this.authenticationApplicatifService.sendToken().subscribe(status => {
        console.log(status);
      });
  }

  initializeControleName() {
    const controlNameConfig: object = {
      'email': 'email',
      'password': 'mot de passe',
      'testa' : 'testa'
    };
    this.controlName = controlNameConfig;
  }
  errorCallback(err: string, title?: string) {
    // console.log(err);
    this.errorMessage = err;
  }

  handleCorrectCaptcha(resultat: string) {
    // console.log(resultat);
    // let token = this.captcha.getResponse();
    // console.log(token);
    if (resultat == null || resultat.length === 0) {
      // this.captcha.reset();
      // console.log('');
    } else {
      this.errorCount = 0;
      this.isValideCpatcha = true;
    }
  }

}
