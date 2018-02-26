import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { PseudoApplicatifServiceACI
} from '../../../service/applicatif/pseudo';

import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";



import { ValidationService } from '../../../contrainte/rule/validation.service';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { Inscription } from '../../../donnee/inscription/inscription';

import { 
  InscriptionApplicatifServiceACI
 } from '../../../service/applicatif/inscription';
import { AppConfig } from 'app/contrainte/config/_app/app.config';

@Component({
  selector: 'app-inscription-confirm-presentation',
  templateUrl: './inscription-confirm-presentation.component.html',
  styleUrls: ['./inscription-confirm-presentation.component.css']
})
export class InscriptionConfirmPresentationComponent implements OnInit {
  confirmForm: any;
  emailControlName: string = "email";
  public currentEmail : string = "";
  public allStepCompleted = false;
    mailNotAutorized : string;
    public emailError : string = "";

    inscription : Inscription;
  public informationMessage : string = "";
  public errorMessage : string = "";
    public isCouple : boolean = false;
    public pseudos: any[];
    public mailsForbidden: any[];
    @ViewChild('email') email: ElementRef;

    constructor(
    private pseudoApplicatifService : PseudoApplicatifServiceACI,
    private router: Router,
    private sharedDataService: SharedDataService,
    private inscriptionApplicatifServiceACI : InscriptionApplicatifServiceACI,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private administrationApplicatifServiceACI: AdministrationApplicatifServiceACI,
    private appConfig: AppConfig,
  ) { 
    //this.currentEmail = "mamisonr@gmail.com";
    this.confirmForm = this.formBuilder.group({
        'email': ['', [ValidationService.emailNotRequiredValidator, this.isMailExcluded.bind(this)]]
      }
    );
  }
    isMailExcluded(control: FormControl) {
        let isInvalidMail = false;
        if( control.value !== "")
        {
            const mail = control.value;
            const mailLower =  mail.toLocaleLowerCase();
            if (this.mailsForbidden) {
                isInvalidMail = this.mailsForbidden.some(it => mailLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1);
            }
        }
        if(isInvalidMail) {
            control.setErrors( {'mailNotAutorized': true} );
            return { 'mailNotAutorized': true }
        }

        return null;
    }


    uncapitalizeFirstLetter(field): void {
        this.emailError = '';
        if (this.confirmForm.controls["email"].value.length === 1) {            
            this.email.nativeElement.value = this.confirmForm.controls[field].value.toLowerCase()                 
        }
    }

    finalizeInscription(): void {
        if (!this.allStepCompleted) {
            this.errorMessage = "vous avez sauter des étapes d'inscription";
            return;
        }
        this.sharedDataService.clearprocessinscriptionsteps();
        this.finalizeConfirm(false, "");
    }

    verifyEmailIfExist() {
        this.confirmForm.controls["email"].setValue(this.confirmForm.controls["email"].value.toLowerCase());
        const dataToVerify = {
            pseudo: "",
            email: this.confirmForm.controls["email"].value,
            idsite: this.appConfig.getSiteIdByLocation()
        };
        this.inscriptionApplicatifServiceACI.verifyUserDatas(dataToVerify)
            .subscribe(res => {
                if (res.exist) {
                    this.emailError = "Email déjà existant dans ce site";
                } else {
                    this.emailError = "";
                }
            },
            err => {
                console.log(err);
            });
    }

    public onSubmit() {
        this.verifyEmailIfExist();
        this.emailToLowerCase();
        
        if (!this.allStepCompleted) {
            this.errorMessage = "vous avez sauter des étapes d'inscription";
            return;
        }
        
        if (this.confirmForm.value.email && this.confirmForm.value.email.length !== 0 && this.confirmForm.status !== 'INVALID') {
            this.inscription.email = this.confirmForm.value.email;
            this.sharedDataService.uid.subscribe(res => {
                if (res && res.length !== 0) {
                    this.inscription.uid = res;     
                    if(!this.confirmForm.invalid && this.emailError.length==0){
                        this.inscriptionprocess();                             
                    }   
                }               
            });
        } 
        
    }

  private finalizeConfirm (hasError,informationMessage) {
    let result = {
      "hasError" : hasError,
      "message" : informationMessage
    };
   
    this.sharedDataService.setInscriptionConfirm(result);
    this.sharedDataService.setEtapeInscription(0);
    this.router.navigate(['/splashcreen']);
  }

  public inscriptionprocess() {
      this.inscriptionApplicatifServiceACI.getIp().subscribe(address=>{
          this.inscription.ip = address.ip;
          this.doInscription();
      });
      
  }

  emailToLowerCase(): void {
      this.confirmForm.controls["email"].setValue(this.confirmForm.controls["email"].value.toLowerCase());
  }

    doInscription() {
        if (this.confirmForm.status !== 'INVALID') {
            this.inscriptionApplicatifServiceACI.postInscription(this.inscription).subscribe(inscription => {
                //console.log(inscription);

                this.reinitializeMessage();
                let hasError = false;
                let informationMessage = "Un email vous a été envoyé, pour terminer votre inscription";
                if (inscription) {
                    if (inscription.status === 200) {
                        //this.informationMessage = "Un email vous a été envoyé, pour terminer votre inscription, cliquez sur le lien de confirmation d'inscription contenu dans l'email envoyé.";
                        this.sharedDataService.clearprocessinscriptionsteps();
                        this.finalizeConfirm(hasError, informationMessage);
                    }
                    else {
                        hasError = true;
                        if (inscription.error !== null) {
                            if (inscription.error instanceof Array) {
                                let errMessage = inscription.error[0].message !== undefined ? inscription.error[0].message : inscription.error[0];
                                this.errorCallback(errMessage);
                                //   this.finalizeConfirm(hasError,this.errorMessage );
                                this.sharedDataService.setEtapeInscription(8);
                                this.sharedDataService.setErrorsOnSubscribe(inscription.error);
                                this.router.navigate(['/inscription/compte']);
                            }
                            else {
                                this.errorCallback(inscription.error);
                                this.finalizeConfirm(hasError, this.errorMessage);
                            }

                        }
                        else {
                            //this.informationMessage = "Votre inscription a échoué.";
                            informationMessage = "Votre inscription a échoué.";
                            this.finalizeConfirm(hasError, informationMessage);
                        }

                    }
                }
                /*
                let result = {
                        "hasError" : hasError,
                        "message" : informationMessage
                      };
                      this.sharedDataService.setInscriptionConfirm(result);
                      this.router.navigate(['/splashcreen']);*/
            },
                err => {
                    this.errorCallback(err);
                    let result = {
                        "hasError": true,
                        "message": "le processus d'inscription a échoué"
                    };
                    this.sharedDataService.setInscriptionConfirm(result);
                    //console.log( "err splach" );
                    this.sharedDataService.setEtapeInscription(0);
                    this.router.navigate(['/splashcreen']);
                });
        }

    }

  reinitializeMessage() {
    this.errorMessage = "";
    this.informationMessage = "";
  }
  errorCallback(err: string, title?: string) {
    this.errorMessage = err;
  }
  //ngOnInit() {
  ngOnInit() {
      this.administrationApplicatifServiceACI.listTermes().subscribe(termes => {
            this.mailsForbidden = termes.value.filter(term => term.profil);
       });

      this.pseudoApplicatifService.getPseudo().subscribe(res => {
          this.pseudos = res;
      });
      this.translate.get("mailNotAutorized").subscribe((res:string) => {
          this.mailNotAutorized = res;
      });
    //this.title = "Comptes";
    this.sharedDataService.getEtapeInscription()
    .subscribe(etape => {
        if(etape <9)
        {
          this.router.navigate(['/splashcreen']);
        }
    });
      this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
          let etapes = inscriptionsteps.etapes;
          let etape = etapes.find((item) => item.etape === "etape1")
          this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
              let selectedVe = etape.value.find((item) => item.id === inscription.id_vsetes);
              if(selectedVe && selectedVe.label && selectedVe.label.toLocaleLowerCase().indexOf("couple") !== -1)
              {   this.isCouple = true;
              }
              if((this.isCouple || inscription.id_orientation) && inscription.id_pratique && inscription.id_pratique.length &&
                  inscription.id_recherche /*&& inscription.id_situation*/ &&
                  inscription.id_statut && inscription.id_tendance &&
                  inscription.id_vsetes){
                  this.allStepCompleted = true;
                  //console.log("pratiques",inscription.id_pratique.length);
                  this.currentEmail = inscription.email;
                  //console.log("mail",this.currentEmail);
                //   this.confirmForm.controls.email.setValue(this.currentEmail);
                  this.confirmForm.controls.email.setValue("");
              }
              /*else
               {
               //console.log( "conf2 splach" );
               this.sharedDataService.setEtapeInscription(0);
               this.router.navigate(['/splashcreen']);
               //this.errorMessage = "vous avez sauter des étapes d'inscription";
               }
               */

              /* if(inscription.date_naissance){
               inscription.date_naissance = this.convertDateFormat(inscription.date_naissance,"yyyy-dd-MM");
               } */


              /* if(inscription.date_naissance_c){
               inscription.date_naissance_c = this.convertDateFormat(inscription.date_naissance_c,"yyyy-dd-MM");
               } */
              this.inscription = inscription;

          });
      });
  }

  twoDigit(number: string) {
    if(number===undefined) return number;
    //console.log("before twoDigit : ", number);
    var twodigit = number.length === 2 ? number : "0"+ number;
    //console.log("alter twoDigit", twodigit);
    return twodigit;
  }
  convertDateFormat(dateInit: string, format: string) : string {
    //1 Day
    //0 Month
    if(dateInit && dateInit.indexOf("/") !== -1){
        let dateNaissances = dateInit.split('/');        
        switch (format) {
          case "yyyy-dd-MM":
            if(dateNaissances[0].length === 4) 
            {
              //console.log("yyyy-dd-MM : ", dateNaissances[0], " ",dateInit);
              return dateInit;
            }
            else      
              return dateNaissances[2] + "-" + this.twoDigit(dateNaissances[0]) + "-" + this.twoDigit(dateNaissances[1]);
          case "yyyy/dd/MM":
            if(dateNaissances[0].length === 4) 
            {
              //console.log("yyyy-dd-MM : ", dateNaissances[0], " ",dateInit);
              return dateInit;
            }
            else      
              return dateNaissances[2] + "/" + this.twoDigit(dateNaissances[0]) + "/" + this.twoDigit(dateNaissances[1]);
          case "MM/dd/yyyy":
            if(dateNaissances[2].length === 4) 
              return this.twoDigit(dateNaissances[0]) + "/" + this.twoDigit(dateNaissances[1]) + "/" + dateNaissances[2];              
            else
              return dateInit;
          case "MM-dd-yyyy":
            if(dateNaissances[2].length === 4) 
              return this.twoDigit(dateNaissances[0]) + "-" + this.twoDigit(dateNaissances[1]) + "-" + dateNaissances[2];            
            else
              return dateInit;
          default : 
              return dateNaissances[2] + "-" + this.twoDigit(dateNaissances[0]) + "-" + this.twoDigit(dateNaissances[1]);
        }
      }
      return dateInit;
  }

}
