import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import {  DomSanitizer } from '@angular/platform-browser';


import { ReCaptchaComponent } from 'angular2-recaptcha';

 import { AppConfig }       from '../../../contrainte/config/_app/app.config';

// import {URLSearchParams} from "@angular/http";

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

import {
  AuthenticationApplicatifServiceACI
 } from '../../../service/applicatif/authentication';

import { ValidationService } from '../../../contrainte/rule/validation.service';


@Component({
  selector: 'app-password-render-mail',
  templateUrl: './password-render-mail.component.html',
  styleUrls: ['./password-render-mail.component.css']
})
export class PasswordRenderMailComponent implements OnInit {
  // public informationMessage : string = "";

   capcha:any;
  public errorconfirmPassword : string = "";
  public errorMessage : string = "";



  slug : String;
  //email : String;
  // pseudo : String;
  user : String;
  idSite : string;
  dateSendMail:String;
  isSubmited : Boolean = false;

  renderMailForm: any;
  public controlName: object = null;
  public submitted: boolean;

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
  ResetPasswordLink : string;
  success : string;
  log : string;

  resetPasswordLang : string

  isValideCpatcha :boolean = false;
  public captchaKey : string = "";

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  constructor(

    private sharedDataService : SharedDataService,
    private translate: TranslateService,
    private authenticationApplicatifServiceACI : AuthenticationApplicatifServiceACI,
    private router: Router,
    private appConfig : AppConfig,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {
      // console.log(window.location.href);
      this.captchaKey = this.appConfig.getConfig('captchaKey');

      // let myurl = this.sanitizer.bypassSecurityTrustUrl(window.location.href);
      // console.log(myurl);
      this.initializeControleName();
      this.renderMailForm = this.formBuilder.group({
          'password': ['', [Validators.required, ValidationService.passwordValidator,
            ValidationService.AccentValidator, ValidationService.specialCharValidator]],
          'confirmPassword': ['', [Validators.required, ValidationService.passwordValidator,
            ValidationService.AccentValidator, ValidationService.specialCharValidator]]
        },
            {
              validator: ValidationService.MatchPassword
            }
      );

      this.renderMailForm.valueChanges.subscribe(data => {
        this.submitted = false;
        this.errorMessage = '';
        this.errorconfirmPassword = '';
      });
  }

  ngOnInit() {

    // console.log("ngOnInit");
    this.initTranslation();
    this.getRouteParams();
    // this.getRouteSnapshotParams();
    // this.getRouteQueryParams();

  }

  /*
  getParam(){
    let params = new URLSearchParams(window.location.search);
    let someParam = params.get('dateSendMail');
     //console.log(router.parseUrl(router.url));
     //encodeURIComponent
  }
  */
  getRouteParams(){
    this.route.params.forEach((params: Params) => {
      this.slug = params["slug"];
      this.dateSendMail = params["dateSendMail"];// .replace("+", " ");

      if(params["dateSendMail"])
        {
          let dateToformat = params["dateSendMail"].split('_');
          // console.log(dateToformat.length);
          this.dateSendMail = dateToformat[0] + "-" + dateToformat[1] + "-" + dateToformat[2] +
            " " + dateToformat[3] + ":" + dateToformat[4] + ":00" ;
        }
      this.user = params["pseudo"];
      this.idSite = params["idSite"];
      });
  }

  initializeControleName(){
    let controlNameConfig : object = {
      "password":"mot de passe",
      "confirmPassword":"confirmation mot de passe"
    }
    this.controlName = controlNameConfig;
  }

  public showInputValidation() {
    Object.keys(this.renderMailForm.controls).forEach(control => {
      this.renderMailForm.controls[control].markAsTouched();
    });
  }

  public disableInputValidation(isConfirm?: boolean) {
      Object.keys(this.renderMailForm.controls).forEach(control => {
          this.renderMailForm.controls[control].markAsPristine();
          this.renderMailForm.controls[control].markAsUntouched();
          this.renderMailForm.controls[control].updateValueAndValidity();
      });
      if (isConfirm) {
         this.errorconfirmPassword = "Le mot de passe et sa confirmation ne correspondent pas";
      } else if (this.renderMailForm.controls["confirmPassword"].value.length !== 0) {
          this.errorconfirmPassword = "Le mot de passe et sa confirmation ne correspondent pas";
      }
  }
  isConfirm = false;
  verifyConfirmPassword(isConfirm?: boolean): void {
      if (this.renderMailForm.controls["confirmPassword"].value.length === 0 && isConfirm) {
          this.errorconfirmPassword = "Veuillez remplir correctement les champs";
          this.renderMailForm.controls["confirmPassword"].setErrors({ 'required': true });
          this.renderMailForm.controls["confirmPassword"].markAsTouched;
      } else {
          if (!isConfirm && this.renderMailForm.controls["confirmPassword"].value.length !== 0 && (this.renderMailForm.controls["password"].value !== this.renderMailForm.controls["confirmPassword"].value)) {
              this.errorconfirmPassword = "Le mot de passe et sa confirmation ne correspondent pas";
          }
          if (isConfirm && (this.renderMailForm.controls["confirmPassword"].value.length === 0 || (this.renderMailForm.controls["password"].value !== this.renderMailForm.controls["confirmPassword"].value))) {
              this.errorconfirmPassword = "Le mot de passe et sa confirmation ne correspondent pas";
          }
      }
  }

  public resetPassword(password: string, confirmPassword: string) {
      this.submitted = true;
      if (!this.renderMailForm.dirty || !this.renderMailForm.valid) {
          this.showInputValidation();
          this.errorMessage = "Veuillez remplir correctement les champs";
          return;
      }
      if (this.renderMailForm.value.password !== this.renderMailForm.value.confirmPassword) {
          this.errorconfirmPassword = "";
          return;
      }
      if (this.renderMailForm.dirty && this.renderMailForm.valid) {
          this.authenticationApplicatifServiceACI.
              confirmResetPassword(this.user, this.slug, this.dateSendMail, password, this.idSite)
              .subscribe(confirmation => {

                  this.isSubmited = true;

                  let hasError = false;
                  let informationMessage = "Votre mot de passe est reinitialisé";

                  if (confirmation.statut === 200) {
                      if (confirmation.result instanceof Array) {
                          informationMessage = this.translateString(confirmation.result[0]);
                      }
                      else {
                          informationMessage = "Votre mot de passe est reinitialisé";
                      }

                  }
                  else {
                      hasError = true;
                      if (confirmation.error instanceof Array) {
                          if (confirmation.error[0]) {
                              informationMessage = this.translateString(confirmation.error[0]);
                              let res = this.translateString(confirmation.result);
                              if (res !== undefined) {
                                  informationMessage = informationMessage + ", " + res;
                              }
                          }
                          else {
                              informationMessage = this.dataInvalid;
                          }
                      }
                      else {
                          informationMessage = "ce lien de reinitialisation de mot de passe n'est pas valide";
                      }
                  }

                  let result = {
                      "hasError": hasError,
                      "message": informationMessage
                  };
                  this.sharedDataService.setResetPassword(result);
                //   sessionStorage.removeItem("id_token");
                  this.router.navigate(['/login']);
              },
              err => {
                  this.isSubmited = true;
                  let hasError = true;
                  let result = {
                      "hasError": true,
                      "message": "ce lien de reinitialisation de mot de passe n'est pas valide"
                  };
                  this.sharedDataService.setInscriptionConfirm(result);
                //   sessionStorage.removeItem("id_token");
                  this.router.navigate(['/login']);
              });
      }

  }

  translateString (initString: string) : string {
      switch (initString) {
          case "ActivationLink":
              return this.ResetPasswordLink;
          case "userNotFoundLdap":
              return this.userNotFoundLdap;
          case "connectionLdapFailed":
              return this.connectionLdapFailed;
          case "passwordInvalid":
              return this.passwordInvalid;
          case "codeConfirmationInvalid":
              return this.codeConfirmationInvalid;
          case "adressEmailInvalid":
              return this.adressEmailInvalid;
          case "DataInvalid":
              return this.dataInvalid;
          case "inputEmpty":
              return this.inputEmpty;
          case "notResult":
              return this.notResult;
          case "resetPasswordFailed":
              return this.resetPasswordFailed;
          case "userNotFound":
              return this.userNotFound;
          case "mailSucces":
              return this.mailSucces;
          case "timeOutConfirmation":
              return this.timeOutConfirmation;
          case "success":
              return this.resetPasswordLang + this.success+"." + this.log;
          case "ResetPassword":
              return this.resetPasswordLang;
          default:
              return initString;
        }
  }


  initTranslation (){
    this.translate.get("ResetPasswordLink").subscribe((res: string) => {
      this.ResetPasswordLink = res;
    });


    this.translate.get("userNotFoundLdap").subscribe((res: string) => {
      this.userNotFoundLdap = res;
    });
    this.translate.get("connectionLdapFailed").subscribe((res: string) => {
      this.connectionLdapFailed = res;
    });
    this.translate.get("passwordInvalid").subscribe((res: string) => {
      this.passwordInvalid = res;
    });
    this.translate.get("codeConfirmationInvalid").subscribe((res: string) => {
      this.codeConfirmationInvalid = res;
    });
    this.translate.get("adressEmailInvalid").subscribe((res: string) => {
      this.adressEmailInvalid = res;
    });
    this.translate.get("DataInvalid").subscribe((res: string) => {
      this.dataInvalid = res;
    });
    this.translate.get("inputEmpty").subscribe((res: string) => {
      this.inputEmpty = res;
    });
    this.translate.get("notResult").subscribe((res: string) => {
      this.notResult = res;
    });
    this.translate.get("resetPasswordFailed").subscribe((res: string) => {
      this.resetPasswordFailed = res;
    });
    this.translate.get("userNotFound").subscribe((res: string) => {
      this.userNotFound = res;
    });
    this.translate.get("mailSucces").subscribe((res: string) => {
      this.mailSucces = res;
    });
    this.translate.get("timeOutConfirmation").subscribe((res: string) => {
      this.timeOutConfirmation = res;
    });

    this.translate.get("success").subscribe((res: string) => {
      this.success = res;
    });
    this.translate.get("log").subscribe((res: string) => {
      this.log = res;
    });
    this.translate.get("ResetPassword").subscribe((res: string) => {
      this.resetPasswordLang = res;
    });

  }

  // captcha
  handleCorrectCaptcha(resultat: string) {
    // console.log(resultat);
    // let token = this.captcha.getResponse();
    // console.log(token);
    if (resultat == null || resultat.length === 0) {
      // this.captcha.reset();
    }
    else {
      this.isValideCpatcha = true;
    }
  }

}
