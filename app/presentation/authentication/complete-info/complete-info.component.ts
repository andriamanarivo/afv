import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdOptionSelectionChange } from '@angular/material';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { InscriptionApplicatifServiceACI } from '../../../service/applicatif/inscription';
import { CryptionAesService } from '../../../commun/cryption-aes.service';

import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../contrainte/rule/validation.service';

import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { AuthenticationApplicatifServiceACI
} from '../../../service/applicatif/authentication';
import { SharedService } from '../../../commun/shared-service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home/home.applicatif.service.aci';
import { ValidationFactoryService } from '../../../contrainte/rule/validation.factory.service';
import { UtilityFactory } from '../../../contrainte/factory/_app/utility.factory';

import { TranslateService } from 'ng2-translate';
import { AdministrationApplicatifService } from 'app/service/applicatif/administration';

@Component({
  selector: 'app-complete-info',
  templateUrl: './complete-info.component.html',
  styleUrls: ['./complete-info.component.css']
})
export class CompleteInfoComponent implements OnInit {
    isFirstcnx = false;
    pseudoExistant: string;
    pseudoError='';
    pseudoNotAutorized: string;
    pseudosForbidden: any;
    errorPseudoMessage: string;
    /* actionMessage: string; */
    public sexes: any = [{'name': 'masculin' , value : 'homme'},
    {'name': 'masculin' , value : 'homme'},
    {'name': 'masculin' , value : 'homme'},
    {'name': 'masculin' , value : 'homme'}];
    public states: any ;
    public statuts: any ;
    public orientations: any ;
    public tendances: any ;
    public pratiques: any ;
    public etape1Couple: any ;
    public etape2Couple: any ;
    errorMessage: any;
    idSite: any;
    disabled = false;
    isCouple = false;
    coupleNormal= false;
    compteForm: any;
    controlName: any;
    public errorbirthMessage = '';
    public errorbirthCoMessage = '';
    dateInvalid: string;
    minorNotAutorized: string;
    isPseudo: string;
    testPseudo = false;
    loading = false;

    @ViewChild('birthMonth') birthMonth: ElementRef;
    @ViewChild('birthYear') birthYear: ElementRef;
    @ViewChild('birthCoMonth') birthCoMonth: ElementRef;
    @ViewChild('birthYearC') birthYearC: ElementRef;
    @ViewChild('pseudo') pseudo: ElementRef;
  constructor(private inscriptionApplicatifService: InscriptionApplicatifServiceACI,
              private authenticationApplicatifServiceACI: AuthenticationApplicatifServiceACI,
              private administrationApplicatifService: AdministrationApplicatifService,
      private cryptionAesService: CryptionAesService,
      private formBuilder: FormBuilder,
      private appConfig: AppConfig,
      private authApplicatifService: AuthenticationApplicatifService,
      private sharedService: SharedService,
      private sharedDataService: SharedDataService,
      private translate: TranslateService,
      private utilityFactory: UtilityFactory,
      private router: Router,
      private homeApplicativeService: HomeApplicatifServiceACI,
      private jwtHelper: JwtHelper) {
        this.translate.get('dateInvalid').subscribe((res: string) => {
            this.dateInvalid = res;
        });

        this.translate.get('minorNotAutorized').subscribe((res: string) => {
            this.minorNotAutorized = res;
        });

        this.translate.get('pseudoNotAutorized').subscribe((res: string) => {
            this.pseudoNotAutorized = res;
        });

        this.initializeControleName();
        this.isPseudo = sessionStorage.getItem('isPseudo');
        console.log(this.isPseudo);
        this.compteForm = this.formBuilder.group({
            'sexe': ['', [Validators.required]],
            'statut': ['', [Validators.required]],
            'pseudo': ['', [Validators.required]],
            'tendance': ['', [Validators.required]],
            'pratique': ['', [Validators.required]],
            'birthDay': ['', [Validators.required]],
            'birthMonth': ['', [Validators.required, ValidationService.monthValidator]],
            'birthYear': ['', [Validators.required, ValidationService.yearValidator, ValidationService.MajorityValidator]],
            'birthCoDay': ['', [Validators.required]],
            'birthCoMonth': ['', [Validators.required, ValidationService.monthValidator]],
            'birthYearC': ['', [Validators.required, ValidationService.yearValidator, ValidationService.MajorityValidator]]
        });
        if (this.isPseudo && this.isPseudo === 'true') {
            this.compteForm = this.formBuilder.group({
                            'pseudo': ['', [Validators.required, ValidationService.DeuxPremierAlphabet, ValidationService.pseudoValidator,
                            this.isPseudoExcluded.bind(this), ValidationService.lengthValidator,
                            ValidationService.AccentValidator, ValidationService.pseudoSpecialCharValidator]]});
            
        }else {
            this.clearOthersValidator();
            if(this.isCouple){
                this.compteForm.setValidators([ValidationService.DayValidator, ValidationService.DayConjointValidator])                        
            } else {
                this.compteForm.setValidators([ValidationService.DayValidator])                                        
            }
        }
        // this.compteForm.valueChanges.subscribe(d=>{
        //     console.log(this.compteForm);
        // });

        this.sharedService.isFirstConnexion.subscribe(res=>{
            if(res){
                this.isFirstcnx = res;
            }
        });
    }

    clearOthersValidator () {

        this.compteForm.controls['sexe'].clearValidators();
        this.compteForm.controls['sexe'].updateValueAndValidity();

        this.compteForm.controls['statut'].clearValidators();
        this.compteForm.controls['statut'].updateValueAndValidity();

        this.compteForm.controls['tendance'].clearValidators();
        this.compteForm.controls['tendance'].updateValueAndValidity();

        this.compteForm.controls['pratique'].clearValidators();
        this.compteForm.controls['pratique'].updateValueAndValidity();

        this.compteForm.controls['birthDay'].clearValidators();
        this.compteForm.controls['birthDay'].updateValueAndValidity();
        this.compteForm.controls['birthMonth'].clearValidators();
        this.compteForm.controls['birthMonth'].updateValueAndValidity();
        this.compteForm.controls['birthYear'].clearValidators();
        this.compteForm.controls['birthYear'].updateValueAndValidity();
        this.compteForm.controls['birthCoDay'].clearValidators();
        this.compteForm.controls['birthCoDay'].updateValueAndValidity();
        this.compteForm.controls['birthCoMonth'].clearValidators();
        this.compteForm.controls['birthCoMonth'].updateValueAndValidity();
        this.compteForm.controls['birthYearC'].clearValidators();
        this.compteForm.controls['birthYearC'].updateValueAndValidity();
    }

    isPseudoExcluded(control: FormControl) {
        let pseudoValidation =  {
            excluded: false,
            message : []
        };
        if (control.value !== '') {
            const pseudo = control.value;
            const pseudoLower = pseudo.toLocaleLowerCase();
            if (this.pseudosForbidden) {
                /* isInvalidPseudo = this.pseudosForbidden.some(it => pseudoLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1); */
                const exludedFilter = this.pseudosForbidden.filter(excluded =>
                    pseudoLower.includes(excluded.value.trim().toLocaleLowerCase()));
                pseudoValidation =  {
                        excluded:  exludedFilter.length > 0,
                        message : exludedFilter
                    };
            }
        }
        if (pseudoValidation.excluded) {
            /* control.setErrors({ 'pseudoNotAutorized': true });
            return { 'pseudoNotAutorized': true } */
            const pluriel = pseudoValidation.message.length === 1 ? '' : 's';
            const pseudoNotAutorized =  ` ${this.pseudoNotAutorized}. 
                Il contient le${pluriel} mot${pluriel} "${pseudoValidation.message.map(res => res.value).join('", "')}". `;

            const res = {};
            res[pseudoNotAutorized] = true;
            control.setErrors(res);

            return res;
        }

        return null;
    }

    ngOnInit() {
      this.idSite = this.appConfig.getSiteIdByLocation();
      const inscription =  this.inscriptionApplicatifService.getInscription(1);
      inscription.subscribe(inscription => {
          if (inscription) {
            this.sexes = inscription.etapes[0]['value'];
            this.etape1Couple = inscription.etapes[1]['value'];
            this.etape2Couple = inscription.etapes[2]['value'];
            this.orientations = inscription.etapes[3]['value'];
            this.tendances = inscription.etapes[5]['value'];
            this.pratiques = inscription.etapes[6]['value'];
            this.statuts = this.etape1Couple;
          }
      });
      this.administrationApplicatifService.listTermes().subscribe(termes => {
        this.pseudosForbidden = termes.value.filter(term => term.pseudo);
    });
    }

    changeSexe(data){
        if (data.toLocaleLowerCase().indexOf('couple') !== -1) {
            this.isCouple = true;
            this.coupleNormal = false;
            this.statuts = this.etape2Couple;
        } else {
            this.coupleNormal = true;
            const control: FormControl = new FormControl('', Validators.required);
            this.compteForm.addControl('orientation', control);
            this.isCouple = false;
            this.statuts = this.etape1Couple;
        }
    }

    initializeControleName() {
        const controlNameConfig: any = {
            'birthDay': 'jour',
            'birthMonth': 'mois',
            'birthYear': 'année',
            'birthCoDay': 'jour',
            'birthCoMonth': 'mois',
            'birthYearC': 'année'
        };
        this.controlName = controlNameConfig;
    }

    public showInputValidation() {
        Object.keys(this.compteForm.controls).forEach(control => {
            this.compteForm.controls[control].markAsTouched();
        });
    }
    completeAndLog() {
        this.markAsTouched();
        let isValid = true;

        this.errorbirthMessage = '';
        this.errorbirthCoMessage = '';
        this.loading = true;
        this.sharedService.showAddPhotoProfilModal.next(this.isFirstcnx);
        if (this.isPseudo === 'false') {
            if (!this.isCouple) {
                this.compteForm.controls['birthCoDay'].setErrors(null);
                this.compteForm.controls['birthCoMonth'].setErrors(null);
                this.compteForm.controls['birthYearC'].setErrors(null);
            }
            if(this.isCouple){
                if (this.compteForm.controls.birthCoDay.invalid) {
                    isValid = false;
                    this.loading = false;
                }
                if (this.compteForm.controls.birthCoMonth.invalid) {
                    isValid = false;
                    this.loading = false;
                }
                if (this.compteForm.controls.birthYearC.invalid) {
                    isValid = false;
                    this.loading = false;
                }
            }

            if (this.compteForm.controls.birthDay.invalid) {
                isValid = false;
                this.loading = false;
            }
            if (this.compteForm.controls.birthMonth.invalid) {
                isValid = false;
                this.loading = false;
            }
            if (this.compteForm.controls.birthYear.invalid) {
                isValid = false;
                this.loading = false;
            }

            // if (!this.checkDateIsValid(false, 'birthDay', 'birthMonth', 'birthYear')) {
            //     isValid = false;
            // }
            // if (this.isCouple && !this.checkDateIsValid(true, 'birthCoDay', 'birthCoMonth', 'birthYearC')) {
            //     isValid = false;
            // }

            if (this.compteForm.controls.sexe.invalid) {
                isValid = false;
                this.loading = false;
            } else if (this.compteForm.controls.statut.invalid) {
                isValid = false;
                this.loading = false;
            } else if (this.coupleNormal) {
                    if (this.compteForm.controls.orientation.invalid) {
                        isValid = false;
                        this.loading = false;
                    }
                    this.loading = false;
            } else if (this.compteForm.controls.tendance.invalid) {
                isValid = false;
                this.loading = false;
            } else if (this.compteForm.controls.pratique.invalid === '') {
                isValid = false;
                this.loading = false;

            } 
            
            if (isValid) {
                this.errorMessage = null;
                const dateNaissConjoint = this.isCouple ? this.compteForm.controls['birthYearC'].value + '-' +
                this.compteForm.controls['birthCoMonth'].value + '-' +
                this.compteForm.controls['birthCoDay'].value : '';

                let mail = sessionStorage.getItem('rfMl');
                let password = sessionStorage.getItem('rfPw');

                if (mail !== undefined && mail !== null && password !== undefined && password !== null ) {
                    mail = this.cryptionAesService.decryptMessage(mail);
                    password = this.cryptionAesService.decryptMessage(password);
                }

                const sexe = this.compteForm.controls['sexe'].value;
                const statut = this.compteForm.controls['statut'].value;
                let orientation = '';
                if (this.coupleNormal) {
                    orientation = this.compteForm.controls['orientation'].value;
                }
                const tendance = this.compteForm.controls['tendance'].value;
                const pratique = this.compteForm.controls['pratique'].value;
                const dateNaiss = this.compteForm.controls['birthYear'].value + '-' +
                    this.compteForm.controls['birthMonth'].value + '-' +
                    this.compteForm.controls['birthDay'].value;
                const data = {
                    '_email': mail,
                    '_password': password,
                    'idVsetes': sexe,
                    'idStatut': statut,
                    'idOrientation': orientation,
                    'idTendance': tendance,
                    'idPratique': pratique,
                    'dateNaissance': dateNaiss,
                    'dateConjoint': dateNaissConjoint,
                    'idSite': this.idSite
                };
                console.log('data', data);
                this.saveUpdateUser(data, password);

            }
        } else {
            if (this.compteForm.valid &&  isValid) {
                const pseudo = this.compteForm.controls['pseudo'].value;
                const mail = sessionStorage.getItem('rfMl');
                this.cryptionAesService.decryptMessage(mail);
                this.updatePseudo(pseudo, this.cryptionAesService.decryptMessage(mail));
            } else {
                this.errorMessage = 'Veuillez remplir correctement le champ pseudo';
                this.loading = false;
            }
        }
    }

    private checkDateIsValid(isConjoint: boolean, birthCoDayontrol: string, birthCoMonthontrol: string, birthYearControl: string) {
        let isValid = true;
        const dateNaissance = this.compteForm.controls[birthYearControl].value + '-' +
        this.compteForm.controls[birthCoMonthontrol].value + '-' +
        this.compteForm.controls[birthCoDayontrol].value;


        const messageConjoint = isConjoint ? ' conjoint' : '';

        if (dateNaissance !== undefined) {
            if (!ValidationFactoryService.isdateValid(this.compteForm.controls[birthCoDayontrol].value,
                this.compteForm.controls[birthCoMonthontrol].value,
                this.compteForm.controls[birthYearControl].value)) {
                this.setBirthErrorMessage(isConjoint, this.dateInvalid);
                // this.errorMessage = this.dateInvalid + messageConjoint;
                // this.MarkAsMinorNotValid(false,"dateInvalid");
                isValid = false;
            } else {
                if (this.utilityFactory.isFutureDate(this.compteForm.controls[birthCoDayontrol].value,
                    this.compteForm.controls[birthCoMonthontrol].value,
                    this.compteForm.controls[birthYearControl].value)) {
                    // this.errorMessage = this.dateInvalid + messageConjoint;
                    this.setBirthErrorMessage(isConjoint, this.dateInvalid);
                    isValid = false;
                } else {
                    const isMajor = this.utilityFactory.calculateAge(this.compteForm.controls[birthCoDayontrol].value,
                        this.compteForm.controls[birthCoMonthontrol].value,
                        this.compteForm.controls[birthYearControl].value);
                    if (!isMajor) {
                        this.MarkAsMinorNotValid(true, this.minorNotAutorized);
                        // this.errorDateMessage = this.minorNotAutorized + messageConjoint;
                        this.setBirthErrorMessage(isConjoint, this.minorNotAutorized);
                        isValid = false;
                    }
                }

            }
        } else {
            this.MarkAsMinorNotValid(true, '');
            // this.errorMessage = this.dateInvalid + messageConjoint;
            this.setBirthErrorMessage(isConjoint, this.dateInvalid);
            isValid = false;
        }
        return isValid;
    }

    private setBirthErrorMessage(isConjoint, errorMessage) {
        if (!isConjoint) {
            this.errorbirthMessage = errorMessage;
        } else {
            this.errorbirthCoMessage = errorMessage;
        }
    }

    public MarkAsMinorNotValid(isrequired: boolean, errorMessage) {
        let birthCoDayontrol = 'birthDay';
        let birthCoMonthontrol = 'birthMonth';
        let birthYearControl = 'birthYear';
        if (this.isCouple) {
            birthCoDayontrol = 'birthCoDay';
            birthCoMonthontrol = 'birthCoMonth';
            birthYearControl = 'birthYearC';
        }

        if (!isrequired) {
            this.compteForm.controls[birthCoDayontrol].setErrors(this.setControllError(birthCoDayontrol, errorMessage));
            this.compteForm.controls[birthCoMonthontrol].setErrors(this.setControllError(birthCoMonthontrol, errorMessage));
            this.compteForm.controls[birthYearControl].setErrors(this.setControllError(birthYearControl, errorMessage));
        }
        // tslint:disable-next-line:no-unused-expression
        this.compteForm.controls[birthCoDayontrol].markAsTouched;
        // tslint:disable-next-line:no-unused-expression
        this.compteForm.controls[birthCoMonthontrol].markAsTouched;
        // tslint:disable-next-line:no-unused-expression
        this.compteForm.controls[birthYearControl].markAsTouched;
    }

    setControllError(controlName: string, errorMessage: string) {
        const error = {};
        // error[errorMessage] = true;
        if (errorMessage === 'dateInvalid') {
            switch (controlName) {
                case 'birthDay':
                    errorMessage = 'invalidDay';
                    break;
                case 'birthMonth':
                    errorMessage = 'invalidMonth';
                    break;
                case 'birthYear':
                    errorMessage = 'invalidYear';
                    break;
                default:
                    break;
            }
        }
        error[errorMessage] = true;
        return error;
    }
  
    dayOrMonthChange(field): void {
        const d = this.compteForm.controls[field].value * 1;
        const c = field === 'birthDay' || field === 'birthCoDay' ?
            d >= 4 : (field === 'birthMonth' || field === 'birthCoMonth' ? d >= 2 : true);
        if (this.compteForm.controls[field].value.length === 2 || c) {
            switch (field) {
                case 'birthDay':
                    this.birthMonth.nativeElement.focus();
                    break;
                case 'birthMonth':
                    this.birthYear.nativeElement.focus();
                    break;
                case 'birthCoDay':
                    this.birthCoMonth.nativeElement.focus();
                    break;
                case 'birthCoMonth':
                    this.birthYearC.nativeElement.focus();
                    break;
                default:
                    break;
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

    saveUpdateUser(data, password){
        this.authenticationApplicatifServiceACI.completeAndLog(data).subscribe(authentication => {
                // this.authenticationApplicatifServiceACI.logout();
                this.authenticationApplicatifServiceACI.updateConnectionStatus('0').subscribe(status => {
                     console.log(status);
                });
                this.loading = false;
                if (authentication.statusCode === 200) {
                    this.authenticationApplicatifServiceACI.updateConnectionStatus('1');
                    // this.sharedService.showAddPhotoProfilModal.next(this.isFirstcnx);
                    this.router.navigate(['/home/user']);
                } else {
                    this.errorMessage = 'erreur lors de l\'authentification';
                }

            },
            err => {
                console.log('erreur authentification');
                this.loading = false;
            });
    }

    markAsTouched(): void {
        Object.keys(this.compteForm.controls).forEach(key => {
            this.compteForm.controls[key].markAsTouched();
        });
    }

    verifyPseudoIfExist() {
         /* this.actionMessage = 'vérification pseudo'; */
        this.testPseudo = true;
        this.pseudoExistant = '';
        const dataToVerify = {
            pseudo: this.compteForm.controls['pseudo'].value,
            email: '',
            idsite: this.appConfig.getSiteIdByLocation()
        };
        this.verifyDatas(dataToVerify);
    }
    
    verifyDatas(dataToVerify: any) {
        this.inscriptionApplicatifService.verifyUserDatas(dataToVerify)
        .subscribe(res => {
            this.testPseudo = false;
            if (res.exist) {
                this.pseudoError = 'Pseudo déjà existant dans ce site';
            }
        },
        err => {
            this.testPseudo = false;
            /* this.actionMessage = ''; */
            console.log(err);
            return null;
        });
    }

    uncapitalizeFirstLetter(field): void {
        this.errorMessage = '';
        if (this.compteForm.controls[field].value.length === 1) {
            this.pseudo.nativeElement.value = this.compteForm.controls[field].value.toLowerCase();
        }
    }

    updatePseudo(pseudo, email){
        email = email.trim();
        this.homeApplicativeService.updatePseudoEmail(pseudo, email).subscribe(oUser => {
            if (oUser.json().status && oUser.json().status !== 200) {
                const errorMsg = oUser.json().error && oUser.json().error[0] ? oUser.json().error[0] : 'Pseudo déjà existant';
                this.errorMessage = errorMsg;
                this.loading = false;
            } else {
                console.log('passer', pseudo);
                this.loading = false;
                this.sharedService.onUpdateSetting.next(pseudo);
                this.router.navigate(['/home/user']);
            }
        });
    }

    public logout() {
        const isLogout = true;
        this.authApplicatifService.updateConnectionStatus('0').subscribe(status => {
            console.log(status);
          });

        this.sharedService.setActivateIdle = false;
        
        sessionStorage.setItem('waitingLogout', '1');
        this.sharedService.setChatDisconnection(true);
        sessionStorage.removeItem('allUnreadMessageCount');
        sessionStorage.removeItem('ctJid');
        sessionStorage.removeItem('rfIl');
        sessionStorage.removeItem('rfIp');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('rfIuid');
         sessionStorage.removeItem('isPseudo');
         sessionStorage.removeItem('selectedContactUid');
        this.sharedService.setTchatMessageCount = 0;
        this.sharedDataService.inscriptionConfirm.next({message: '', hasError: false});
        this.sharedDataService.resetPassword.next({message: '', hasError: false});
    }

    getInputColor() {
        return this.pseudoError.length !== 0 ? 'red' : '';
    }

}
