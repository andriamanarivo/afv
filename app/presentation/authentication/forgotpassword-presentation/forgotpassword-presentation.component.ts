import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../contrainte/config/_app/app.config';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { InscriptionApplicatifServiceACI } from '../../../service/applicatif/inscription';


import { AuthenticationApplicatifServiceACI
 } from '../../../service/applicatif/authentication';
import { ValidationService } from '../../../contrainte/rule/validation.service';

@Component({
  selector: 'app-forgotpassword-presentation',
  templateUrl: './forgotpassword-presentation.component.html',
  styleUrls: ['./forgotpassword-presentation.component.css']
})
export class ForgotpasswordPresentationComponent implements OnInit {

  passwordForm: any;
  public controlName: object = null;
  ResetPasswordLink: string;
  ResetPasswordLink1: string;
  wrongMailOrPassword: string;
  hasError = false;
  // informationMessage : string = "";

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
  emailError: string;
  sendFailed: string;
  pseudoError: string;
  timeOutConfirmation: string;
  reinitpassword: string;
  public informationMessage = '';

  pseudoExist= true;
 emailExist= true;
  sendEmailMessage = 'Valider';
  load= false;
  exist= false;
    isActive= true;
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private appConfig: AppConfig,
    public authenticationApplicatifService: AuthenticationApplicatifServiceACI,
    private inscriptionApplicatifServiceACI: InscriptionApplicatifServiceACI,
    ) {

      this.initializeControleName();
      this.passwordForm = this.formBuilder.group({
              /* 'userpseudo': ['', [Validators.required, ValidationService.pseudoValidator,
                ValidationService.AccentValidator,ValidationService.specialCharValidator]] */
             'userpseudo': ['', Validators.required,]
            }
          );

   }

  verifyEmailIfExist() {
    //   this.passwordForm.controls["email"].setValue(this.passwordForm.controls["email"].value.toLowerCase());
    if(this.passwordForm.controls['userpseudo'].valid){
        const dataToVerify = {
            pseudo: '',
            email: this.passwordForm.controls['userpseudo'].value.toLowerCase(),
            idsite: this.appConfig.getSiteIdByLocation()
        };
        this.verifyDatas(dataToVerify, true);
    }
      else this.load = false;

  }

  verifyPseudoIfExist() {
    //   this.passwordForm.controls["email"].setValue(this.passwordForm.controls["email"].value.toLowerCase());
      if(this.passwordForm.controls['userpseudo'].valid){
            const dataToVerify = {
                pseudo: this.passwordForm.controls['userpseudo'].value.toLowerCase(),
                email: '',
                idsite: this.appConfig.getSiteIdByLocation()
            };
            this.verifyDatas(dataToVerify, false);
      }
      else this.load = false;
  }

  blurPseudoMailExist(){
      this.load = true;
    //   console.log(this.passwordForm.controls['userpseudo'].value.indexOf('@'));
      if(this.passwordForm.controls['userpseudo'].value.indexOf('@')===-1){
          this.verifyPseudoIfExist();
      }else{
          this.verifyEmailIfExist();
      }
  }

  verifyDatas(dataToVerify: any, isEmail: boolean) {
        this.inscriptionApplicatifServiceACI.verifyUserDatas(dataToVerify)
            .subscribe(res => {
                    if (isEmail) {
                        //this.emailExist= res.exist;
                        if(!res.exist){
                            this.hasError = true;
                            this.informationMessage=this.translateString('userNotFound');
                        }
                    } else {
                        //this.pseudoExist= res.exist;
                        if(!res.exist){
                            this.hasError = true;
                            this.informationMessage=this.translateString('userNotFound');
                        }
                    }
                    if(res.exist) this.isActive = res.active;
                    this.load = false;
        },
        err => {
            this.load = false;
            console.log(err);
        });
  }

   emailToLowerCase(): void {
        this.passwordForm.controls['userpseudo'].setValue(this.passwordForm.controls['userpseudo'].value.toLowerCase());
   }


  ngOnInit() {
    this.initTranslation();
  }
    public onSubmit() {
        this.sharedDataService.clearprocessinscriptionsteps();
        this.sharedDataService.setEtapeInscription(1);
        this.router.navigate(['/inscription/Vousetes']);
    }


    initTranslation () {
    this.translate.get('ResetPasswordLink').subscribe((res: string) => {
      this.ResetPasswordLink = res;
    });
    this.translate.get('ResetPasswordLink1').subscribe((res: string) => {
        this.ResetPasswordLink1 = res;
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

    this.translate.get('sendFailed').subscribe((res: string) => {
        this.sendFailed = res;
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
    this.translate.get('reinitpassword').subscribe((res: string) => {
      this.reinitpassword = res;
    });

  }

  translateString (initString: string): string {
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
            if (!this.emailExist && !this.pseudoExist) {
                return '';
            }
            return this.userNotFound;
        case 'mailSucces':
            return this.mailSucces;
        case 'sendFailed':
            return this.sendFailed;
        case 'timeOutConfirmation':
            return this.timeOutConfirmation;
        case 'reinitpassword':
            return this.reinitpassword;
        default:
            return this.dataInvalid;
        }
  }

  uncapitalizeFirstLetter(event): void {
      if (this.passwordForm.controls['userpseudo'].value.length < 2) {
          this.hasError = true;
          this.passwordForm.controls['userpseudo'].setValue(this.passwordForm.controls['userpseudo'].value.toLowerCase());
          this.informationMessage=this.translateString('reinitpassword');
      }else{
          this.informationMessage="";
      }
  }

  public showInputValidation() {
    if (!this.passwordForm.dirty || !this.passwordForm.valid) {
      for (const i in this.passwordForm.controls) {
        if (this.passwordForm.controls.hasOwnProperty(i)) {
            this.passwordForm.controls[i].markAsTouched();
        }
      }
    }
  }
  public sendmail(user: string) {
    this.hasError = false;
    if (!this.passwordForm.dirty || !this.passwordForm.valid || (!this.emailExist && !this.pseudoExist)) {
        this.showInputValidation();
        return;
    }
    if (this.passwordForm.controls['userpseudo'].value.length < 2) {
          this.hasError = true;
          this.informationMessage=this.translateString('reinitpassword');
          return;
    }

    this.load = true;
    this.sendEmailMessage = 'Envoi d\'email en cours...';
    this.authenticationApplicatifService.resetPassword({"user" : user, "isActive": this.isActive}, '')
        .subscribe(res => {
            this.load = false;
            this.sendEmailMessage = 'Valider';
            if (res.status === 200) {
                this.hasError = false;
                this.informationMessage = this.isActive? this.ResetPasswordLink: this.ResetPasswordLink1;
            } else {
                this.hasError = true;
                this.load = false;
                if (res.error instanceof Array) {
                    if (res.error[0]) {
                        this.informationMessage = this.translateString(res.error[0]);
                    } else {
                        this.informationMessage = this.dataInvalid;
                    }
                } else {
                    this.informationMessage = this.dataInvalid;
                }
            }
        },
        err => {
            this.sendEmailMessage = 'Valider';
            this.hasError = true;
            this.load = false;
            this.informationMessage = 'Une erreur est survenue';
        });
  }


  initializeControleName() {
    const controlNameConfig: object = {
      'userpseudo': 'pseudo ou mail'
    };
    this.controlName = controlNameConfig;
  }


}
