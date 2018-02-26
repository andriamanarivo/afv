import { Component, OnInit , Input } from '@angular/core';
import { SwitchCheckboxComponent } from '../switch-checkbox/switch-checkbox.component';
import { CustomColorPickerComponent } from '../custom-color-picker/custom-color-picker.component';
//
import { SiteMock, LibelleDroits, SiteDto, SiteInit } from '../../../donnee/site';
import { SiteApplicatifServiceACI } from '../../../service/applicatif/site';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import {Router, ActivatedRoute} from '@angular/router';

import { MdOptionSelectionChange} from '@angular/material';


import {  DomSanitizer } from '@angular/platform-browser';

import { AuthenticationApplicatifServiceACI
 } from '../../../service/applicatif/authentication';

 import { ValidationService } from '../../../contrainte/rule/validation.service';


@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css']
})
export class SiteDetailComponent implements OnInit {

  siteDetailForm: any;
  errorMessage: any;
  public controlName: object = null;
  loading = false;
  public informationMessage = '';
  alertCssClass: string;
  hasError = false;
  isLoading = false;

  selectedColor: string;
  uid: string;
  siteDto:  any = {};

  logoFile: any = {};
  public columns: Array<any> = [];
    public langue: any = [];
    public useLangue: any;
  public thematiques: any = [];
  public thematique: any = {'libelle': '', 'uid': ''};
  public config: any ;
  droitSettings: any;
  colorSettings: any;

  modificationSuccess: string;
  modificationError: string;
  creationSuccess: string;
  creationError: string;
  thematiqueRequired: string;

  droitRoleRequired: string;

  SiteSettingsLogo: string;
  SiteSettingsDescription: string;
  SiteSettingsClientPhone: string;
  SiteSettingsClientEmail: string;
  SiteSettingsAdminPhone: string;
  SiteSettingsAdminEmail: string;
  SiteSettingsModerateurPhone: string;
  SiteSettingsModerateurEmail: string;
  SiteSettingsSitePhone: string;
  SiteSettingsSiteEmail: string;
  SiteSettingsSms: string;
  uploadLogoUrl: string;

  // SiteSettingsLogo

  public mailsForbidden: any[];
  colorlist: any;
  initColors: any = [];
  siteScores: any = [];

  baseUrl = '';

  constructor(
    private siteApplicatifService: SiteApplicatifServiceACI,
    private administrationApplicatifService: AdministrationApplicatifServiceACI,
    public authenticationApplicatifService: AuthenticationApplicatifServiceACI,
    private appConfig: AppConfig,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder

  ) {
      this.initializeSettings();
      this.initializetranslate();
      /*this.hasError = true;
      this.alertCssClass = "danger";
      this.informationMessage = "informationMessageError";
      */

      this.initializeControleName();
      this.siteDetailForm = this.formBuilder.group({
        //
        'site': ['', [Validators.required]],
        'thematique' : ['', [Validators.required]],
        'clientPhone': ['', [Validators.required, ValidationService.phoneSimpleValidator]],
        'description': ['', [Validators.required]],
        'slogan': ['', [Validators.required]],
        'clientEmail': ['', [Validators.required, ValidationService.emailValidator, this.isMailExcluded.bind(this)]],
        'adminPhone': ['', [Validators.required, ValidationService.phoneSimpleValidator]],
        'adminEmail': ['', [Validators.required, ValidationService.emailValidator, this.isMailExcluded.bind(this)]],
        'ModerateurPhone': ['', [Validators.required, ValidationService.phoneSimpleValidator]],
        'ModerateurEmail': ['', [Validators.required, ValidationService.emailValidator, this.isMailExcluded.bind(this)]],
        'sitePhone': ['', [Validators.required, ValidationService.phoneSimpleValidator]],
        'siteEmail': ['', [Validators.required, ValidationService.emailValidator, this.isMailExcluded.bind(this)]],
        'sms': ['', [Validators.required, ValidationService.phoneSimpleValidator]],
        'pointAge': ['', [Validators.required]],
        'pointDistance': ['', [Validators.required]],
        'pointRencontre': ['', [Validators.required]],
        'pointPhotos': ['', [Validators.required]],
        'pointTendance': ['', [Validators.required]],
        'tempConfCompte': ['', [Validators.required]],
        'tempDesactiveUser': ['', [Validators.required]],
        'tempSuspensionUser': ['', [Validators.required]],
        'tempInactiveUser': ['', [Validators.required]],
        });

   }

   isMailExcluded(control: FormControl) {
    let isInvalidMail = false;
    if (control.value !== '') {
        const mail = control.value;
        const mailLower =  mail.toLocaleLowerCase();
        if (this.mailsForbidden) {
            isInvalidMail = this.mailsForbidden.some(it => mailLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1);
        }

    }
    if (isInvalidMail) {
        control.setErrors({ 'mailNotAutorized': true });
        return { 'mailNotAutorized': true };
    }

    return null;
}
   goToList(): void{
    this.router.navigate(['/administration/sites']);
   }

   initializetranslate(){
      this.translate.get('modificationSuccess').subscribe((res: string) => {
        this.modificationSuccess = res;
      });
      this.translate.get('modificationError').subscribe((res: string) => {
        this.modificationError = res;
      });
      this.translate.get('creationSuccess').subscribe((res: string) => {
        this.creationSuccess = res;
      });
      this.translate.get('creationError').subscribe((res: string) => {
        this.creationError = res;
      });
      //
      this.translate.get('thematiqueRequired').subscribe((res: string) => {
        this.thematiqueRequired = res;
      });
      //
      this.translate.get('droitRoleRequired').subscribe((res: string) => {
        this.droitRoleRequired = res;
      });

      this.translate.get('SiteSettingsLogo').subscribe((res: string) => {
        this.SiteSettingsLogo = res;
      });
      this.translate.get('SiteSettingsDescription').subscribe((res: string) => {
        this.SiteSettingsDescription = res;
      });
      this.translate.get('SiteSettingsClientPhone').subscribe((res: string) => {
        this.SiteSettingsClientPhone = res;
      });
      this.translate.get('SiteSettingsClientEmail').subscribe((res: string) => {
        this.SiteSettingsClientEmail = res;
      });
      this.translate.get('SiteSettingsAdminPhone').subscribe((res: string) => {
        this.SiteSettingsAdminPhone = res;
      });
      this.translate.get('SiteSettingsAdminEmail').subscribe((res: string) => {
        this.SiteSettingsAdminEmail = res;
      });
      this.translate.get('SiteSettingsModerateurPhone').subscribe((res: string) => {
        this.SiteSettingsModerateurPhone = res;
      });
      this.translate.get('SiteSettingsModerateurEmail').subscribe((res: string) => {
        this.SiteSettingsModerateurEmail = res;
      });
      this.translate.get('SiteSettingsSitePhone').subscribe((res: string) => {
        this.SiteSettingsSitePhone = res;
      });
      this.translate.get('SiteSettingsSiteEmail').subscribe((res: string) => {
        this.SiteSettingsSiteEmail = res;
      });
      this.translate.get('SiteSettingsSms').subscribe((res: string) => {
        this.SiteSettingsSms = res;
      });


   }
  thematiqueSelected (event: MdOptionSelectionChange, uid: string) {
    if (event.source.selected) {
        // this.selectedCity = city;
        // console.log(thematique);
        this.siteDto.idThematique = uid;
    }
  }

  initSloganControleValue(slogan) {
      this.initializeControleValue('slogan', slogan.slogan);
      this.initializeControleValue('description', slogan.description);
      this.initializeControleValue('clientPhone', slogan.telephoneClient);
      this.initializeControleValue('clientEmail', slogan.mailClient);
      this.initializeControleValue('adminPhone', slogan.telephoneAdmin);
      this.initializeControleValue('adminEmail', slogan.mailAdmin);
      this.initializeControleValue('ModerateurPhone', slogan.telephoneModerateur);
      this.initializeControleValue('ModerateurEmail', slogan.mailModerateur);
      this.initializeControleValue('siteEmail', slogan.mailSite);
      this.initializeControleValue('sitePhone', slogan.telephoneSite);
      this.initializeControleValue('sms', slogan.sms);
  }
  initPointControleValue(point) {
    if (!point) {
      this.initializeControleValue('pointAge', '0');
      this.initializeControleValue('pointDistance', '0');
      this.initializeControleValue('pointRencontre', '0');
      this.initializeControleValue('pointPhotos', '0');
      this.initializeControleValue('pointTendance', '0');
    } else {
      this.initializeControleValue('pointAge', point.pointAge);
      this.initializeControleValue('pointDistance', point.pointDistance);
      this.initializeControleValue('pointRencontre', point.pointRencontre);
      this.initializeControleValue('pointPhotos', point.pointPhotos);
      this.initializeControleValue('pointTendance', point.pointTendance);
    }
  }

  initTimerControleValue(timerValue) {
    if (!timerValue) {
      this.initializeControleValue('tempConfCompte', '0');
      this.initializeControleValue('tempDesactiveUser', '0');
      this.initializeControleValue('tempSuspensionUser', '0');
      this.initializeControleValue('tempInactiveUser', '0');
    } else {
      this.initializeControleValue('tempConfCompte', timerValue.tempConfCompte);
      this.initializeControleValue('tempDesactiveUser', timerValue.tempDesactiveUser);
      this.initializeControleValue('tempSuspensionUser', timerValue.tempSuspensionUser);
      this.initializeControleValue('tempInactiveUser', timerValue.tempInactiveUser);
    }
  }

  ngOnInit() {
    this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
    this.baseUrl = this.baseUrl.replace('/app_dev.php', '');

    this.uploadLogoUrl = 'api/uploadLogoUrl';
    this.isLoading = true;
    this.selectedColor = '#000';
    this.uid = this.route.snapshot.params['id'];

    this.administrationApplicatifService.getCouleur()
          .subscribe(data => {
              const initColors = []
              for (let i = 0 ; i < data.length; i++){
                  initColors.push(
                    {
                      'libelleColor': data[i].libelle,
                      'idColor': data[i].uid
                      , 'valueColor': '#000'
                    } );
              }
              // this.siteDto.colors = initColors;
              this.initColors = initColors;

              // this.uid = "1";
              if (this.uid === undefined || this.uid === '0' || this.uid === '') {
                this.siteApplicatifService.getSiteInit()
                .subscribe(siteDto => {
                  this.siteDto = new Object(siteDto);
                  this.thematique.uid = this.siteDto.idThematique;
                  this.siteDto.colors = this.initColors;

                  // this.initPointControleValue(null);
                  // this.initTimerControleValue(null);



                  /* this.siteApplicatifService.scorableField()
                  .subscribe(scores => {
                    this.siteScores = scores;
                    this.siteScores.map(siteScore => {
                      //this.initializeControleValue('pseudo', this.currentIncription.pseudo);
                      siteScore.value = !siteScore.value ? 0 : siteScore.value;
                      const control: FormControl = new FormControl('', Validators.required);
                      this.siteDetailForm.addControl(siteScore.id,control);
                      //this.controlName = Object.assign(this.controlName, { `$(siteScore.id)` : `$(siteScore.id)`});
                  });
                    //this.initializeControleValue('pseudo', this.currentIncription.pseudo);
                    console.log(this.siteScores);
                  }); */

                });


              } else {
                this.siteApplicatifService.getSite(this.uid)
                .subscribe(siteDto => {
                  this.siteDto = new Object(siteDto);
                  this.thematique.uid = this.siteDto.idThematique;

                  this.initializeControleValue('site', siteDto.siteName);
                  this.initializeControleValue('thematique', this.siteDto.idThematique);
                  if (this.siteDto && this.siteDto.colors && this.siteDto.colors.length === 0) {
                    this.siteDto.colors = this.initColors;
                  }

                  if (this.siteDto.slogan.logo && this.siteDto.slogan.logo.fileUrl) {
                    this.logoFile = {};
                    this.logoFile.fileUrl = this.baseUrl + this.siteDto.slogan.logo.fileUrl;
                  }

                  // this.mockSection();

                  this.initPointControleValue(this.siteDto.point);

                  this.initTimerControleValue(this.siteDto.timer);
                  this.initSloganControleValue(this.siteDto.slogan);
                  // console.log("siteDto",siteDto);
                  // console.log("colors",this.siteDto.colors);
                },
                  err => {
                    this.hasError = true;
                    this.informationMessage = err;
                    this.alertCssClass = 'danger';
                    this.isLoading = false;
                });
              }
          },
          err => {
              // console.log(err);
            this.hasError = true;
            this.informationMessage = err;
          this.alertCssClass = 'danger';
          // this.isLoading = false;
        });


      this.administrationApplicatifService.getThematiques()
          .subscribe(data => {
              this.thematiques = data;
              this.isLoading = false;
          },
          err => {
              // console.log(err);
            this.hasError = true;
            this.informationMessage = err;
            this.alertCssClass = 'danger';
            this.isLoading = false;
          });
  }

  mockSection() {
    const slogan = {
      'slogan': 'zaza',
      // 'logo': 'zaza',
      'description': 'zazazaza',
      'telephoneClient': 'za@gmail.com',
      'mailClient': 'test@gmail.com',
      'telephoneAdmin': '0341122233',
      'mailAdmin': 'test@gmail.com',
      'telephoneModerateur': '0341122233',
      'mailModerateur': 'test@gmail.com',
      'mailSite': 'test@gmail.com',
      'telephoneSite': '0341122233',
      'sms': '0341122233'
    };

    const point = {
      'pointAge': 4,
      'pointDistance': 3,
      'pointRencontre': 4,
      'pointPhotos': 3,
      'pointTendance': 4
    };


    const timer = {
      'tempConfCompte': 4,
      'tempDesactiveUser': 3,
      'tempSuspensionUser': 4,
      'tempInactiveUser': 3
    };

    this.siteDto.slogan = slogan;

    this.siteDto.point = point;

    this.siteDto.timer = timer;
  }
  initializeSettings() {

    this.colorSettings = {
        actions : {add: false, edit: false, delete: false },
        columns: {
          libelleColor : {
            title: ' Libellé de la couleur',
            filter: false,
            sort:false
          },
          valueColor: {
            sort:false,
            title: 'Couleur en hexadécimal',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'valueColor',
                'columnValue' : data
              }
            },
            renderComponent: CustomColorPickerComponent,
            filter: false
          }
        }
      };

    this.droitSettings = {
        actions : {add: false, edit: false, delete: false },
        pager : {
            display : false
            /* ,perPage:5 */
        },
        columns: {
          libelleDroit : {
            title: 'rôle',
            filter: false,
            // class : 'smart-table-first'
            // width: '150px!important;'
          },
          /* visiteur: {
            title: 'Visiteur',
            type:'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'visiteur',
                'columnValue' : data
              }
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }, */
          /* moderateur: {
            title: 'Moderateur',
            type:'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'moderateur',
                'columnValue' : data
              }
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }, */
          /* administrateur: {
            title: 'Administrateur',
            type:'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'administrateur',
                'columnValue' : data
              }
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }, */

          visiteurHomme: {
            title: 'visiteur Homme',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'visiteurHomme',
                'columnValue' : data
              }
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }
          , visiteurFemme: {
            title: 'visiteur Femme',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'visiteurFemme',
                'columnValue' : data
              };
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          },
          abonne: {
            title: 'Abonné Homme',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'abonne',
                'columnValue' : data
              };
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          },
          abonneV1: {
            title: 'abonné Femme',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'abonneV1',
                'columnValue' : data
              };
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }
          , moderateurV1: {
            title: 'moderateur',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'moderateurV1',
                'columnValue' : data
              };
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }
          , administrateurV1: {
            title: 'administrateur',
            type: 'custom',
            valuePrepareFunction: (data) => {
              return {
                'columnName' : 'administrateurV1',
                'columnValue' : data
              };
            },
            renderComponent: SwitchCheckboxComponent,
            filter: false
          }

        }
      };
  }

  public onTextChange($event): void {
    // this.source = $event.source;
    console.log($event.source);
  }

  fileEvent(evt: any) {
    // this.loading = true;
    this.errorMessage = '';
    const files = evt.target.files;
    const file = files[0];
    const pattern = /image-*/;
    if (!file.type.match(pattern)) {
      this.errorMessage = 'invalid format';
      this.alertCssClass = 'danger';
      return;
  }

    if (files && file) {
        const reader = new FileReader();
        this.logoFile.name = file.name;
        this.logoFile.type = file.type;
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.logoFile.fileUrl = binaryString; // this.sanitizer.bypassSecurityTrustUrl(binaryString);
    const resultat: any = readerEvt.target.result.split(',');
    this.logoFile.data = 'data:image/false;base64,' + resultat[1];
}

initializeControleValue(controleName: string, controleValue) {
  if (this.siteDetailForm !== undefined) {
      const currentControl = this.siteDetailForm.controls[controleName];
      if (currentControl && controleValue) {
          currentControl.setValue(controleValue);
      }
  }
}
initializeControleName() {
  const controlNameConfig: object = {
      'site' : 'site',
      'thematique': 'thematique',
      'description' : 'description',
      'slogan': 'slogan',
      'clientPhone': 'clientPhone',
      'clientEmail': 'clientEmail',
      'adminPhone': 'adminPhone',
      'adminEmail': 'adminEmail',
      'ModerateurPhone': 'ModerateurPhone',
      'ModerateurEmail': 'ModerateurEmail',
      'sitePhone': 'sitePhone',
      'siteEmail': 'siteEmail',
      'sms': 'sms',
      'pointAge' : 'pointAge',
      'pointDistance' : 'pointDistance',
      'pointRencontre': 'pointRencontre',
      'pointPhotos': 'pointPhotos',
      'pointTendance' : 'pointTendance',
      'tempConfCompte' : 'tempConfCompte',
      'tempDesactiveUser' : 'tempDesactiveUser',
      'tempSuspensionUser': 'tempSuspensionUser',
      'tempInactiveUser' : 'tempInactiveUser'
  };
  this.controlName = controlNameConfig;
}
  validateVisiteur(siteDto) {
    let isvalidHomme = false;
    let isvalidFemme = false;


    if (siteDto.droitListeProfils.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitListeProfils.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }

    // siteDto.
    if (siteDto.droitRechercheProfils.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitRechercheProfils.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitChat.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitChat.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitProfil.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitProfil.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitAccountSettings.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitAccountSettings.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitFavorisAncAmis.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitFavorisAncAmis.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitVisiteurs.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitVisiteurs.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitBlacklist.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitBlacklist.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitNotificationsEmail.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitNotificationsEmail.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitAffichagePublicite.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitAffichagePublicite.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitSondages.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitSondages.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitPetitesAnnonces.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitPetitesAnnonces.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitConfessionnal.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitConfessionnal.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // --------------------------------
    // siteDto.
    if (siteDto.droitJournalPageEvent.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitJournalPageEvent.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitVisioChat.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitVisioChat.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }
    // siteDto.
    if (siteDto.droitResultatRecherche.find(droit => (droit.visiteurHomme)) !== undefined) {
      isvalidHomme = true;
    }
    if (siteDto.droitResultatRecherche.find(droit => (droit.visiteurFemme)) !== undefined) {
      isvalidFemme = true;
    }

    return isvalidHomme && isvalidFemme;
  }

  public showInputValidation() {
    Object.keys(this.siteDetailForm.controls).forEach(control => {
        this.siteDetailForm.controls[control].markAsTouched();
    });
}
  saveSite() {
    let isValid = true;
    this.isLoading = true;
    this.informationMessage = '';
    if (!this.siteDetailForm.valid) {
      this.informationMessage = 'Veuillez remplir correctement les champs';
      this.showInputValidation();
      this.alertCssClass = 'danger';
      isValid = false;
    }

    const isValidModel = this.validateVisiteur(this.siteDto);
    if (!isValidModel) {
      this.hasError = true;
      this.informationMessage = this.droitRoleRequired;
      this.alertCssClass = 'danger';
      isValid = false;
    }
    if (isValid) {
      if (!this.siteDto.slogan) {
        this.siteDto.slogan = {};
      }

      this.siteDto.siteName = this.siteDetailForm.value.site;

      this.siteDto.slogan.slogan = this.siteDetailForm.value.slogan;
      this.siteDto.slogan.logo = this.logoFile;
      this.siteDto.slogan.description = this.siteDetailForm.value.description;
      this.siteDto.slogan.telephoneClient = this.siteDetailForm.value.clientPhone;
      this.siteDto.slogan.mailClient = this.siteDetailForm.value.clientEmail;
      this.siteDto.slogan.telephoneAdmin = this.siteDetailForm.value.adminPhone;
      this.siteDto.slogan.mailAdmin = this.siteDetailForm.value.adminEmail;
      this.siteDto.slogan.telephoneModerateur = this.siteDetailForm.value.ModerateurPhone;
      this.siteDto.slogan.mailModerateur = this.siteDetailForm.value.ModerateurEmail;
      this.siteDto.slogan.mailSite = this.siteDetailForm.value.siteEmail;
      this.siteDto.slogan.telephoneSite = this.siteDetailForm.value.sitePhone;
      this.siteDto.slogan.sms = this.siteDetailForm.value.sms;

      if (!this.siteDto.timer) {
        this.siteDto.timer = {};
      }
      this.siteDto.point.pointAge = this.siteDetailForm.value.pointAge;
      this.siteDto.point.pointDistance = this.siteDetailForm.value.pointDistance;
      this.siteDto.point.pointRencontre = this.siteDetailForm.value.pointRencontre;
      this.siteDto.point.pointPhotos = this.siteDetailForm.value.pointPhotos;
      this.siteDto.point.pointTendance = this.siteDetailForm.value.pointTendance;

      if (!this.siteDto.timer) {
        this.siteDto.timer = {};
      }
      this.siteDto.timer.tempConfCompte = this.siteDetailForm.value.tempConfCompte;
      this.siteDto.timer.tempDesactiveUser = this.siteDetailForm.value.tempDesactiveUser;
      this.siteDto.timer.tempSuspensionUser = this.siteDetailForm.value.tempSuspensionUser;
      this.siteDto.timer.tempInactiveUser = this.siteDetailForm.value.tempInactiveUser;
      if (!this.authenticationApplicatifService.loggedIn()) {
        this.isLoading = false;
        this.router.navigate(['/login']);
      } else {
        const informationMessageSuccess = this.uid === undefined || this.uid === '0' ? this.creationSuccess : this.modificationSuccess;
        const informationMessageError = this.uid === undefined || this.uid === '0' ? this.creationError : this.modificationError;
        this.siteApplicatifService.addUpdateSite(this.siteDto).subscribe(res => {
          if (res.status === 200) {
            this.isLoading = false;
            this.router.navigate(['administration/sites/' + informationMessageSuccess]);
          } else {
            this.isLoading = false;
            this.hasError = true;
            this.informationMessage = informationMessageError;
            this.alertCssClass = 'danger';
          }

        },
          err => {
            this.isLoading = false;
            this.hasError = true;
            this.alertCssClass = 'danger';
              this.informationMessage = informationMessageError;
          });
      }
    } else {
      this.isLoading = false;
    }
  }

  onColorPickerChange(value: string): void {
    this.selectedColor = value;
  }

  public onListeProfilsCellClick(data: any): any {
    console.log(data);
  }

}
