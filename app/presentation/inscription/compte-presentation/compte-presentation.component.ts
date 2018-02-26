import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdOptionSelectionChange } from '@angular/material';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { User } from '../../../donnee/user/user';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../contrainte/rule/validation.service';
import { PseudoValidationService } from '../../../contrainte/rule/pseudo-validation.service';
import { UtilityFactory } from '../../../contrainte/factory/_app/utility.factory';
import { ValidationFactoryService } from '../../../contrainte/rule/validation.factory.service';

import { InscriptionFactory } from '../../../contrainte/factory/inscription/inscription-factory.service';
import { InscriptionDto, Inscription } from '../../../donnee/inscription';

import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';


import {
    CountryApplicatifServiceACI
} from '../../../service/applicatif/country';

import {
    PseudoApplicatifServiceACI
} from '../../../service/applicatif/pseudo';

import { AppConfig } from '../../../contrainte/config/_app/app.config';

import { Country } from '../../../donnee/country/country';
import { City } from '../../../donnee/city/city';

import { InscriptionApplicatifServiceACI } from '../../../service/applicatif/inscription';

import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';
// import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'app-compte-presentation',
    templateUrl: './compte-presentation.component.html',
    styleUrls: ['./compte-presentation.component.css'],
    providers: [MessageService]
})
export class ComptePresentationComponent implements OnInit {
    public title: string;
    filteredCountries: any;
    filteredCities: any;
    selectedCountry: Country;
    @ViewChild('monthDay') monthDay: ElementRef;
    @ViewChild('monthDayC') monthDayC: ElementRef;
    @ViewChild('yearBirth') yearBirth: ElementRef;
    @ViewChild('yearBirthC') yearBirthC: ElementRef;
    @ViewChild('email') email: ElementRef;
    @ViewChild('pseudo') pseudo: ElementRef;

    // initCountry :Country;
    selectedCity: City;
    countryCtrl: FormControl;
    cityCtrl: FormControl;
    dateNaissanceConjoint: string;
    dateNaissance: string;
    dateNaissanceValid: true;
    dateNaissanceConjointValid: true;
    isObtinChecked = false;
    cities = [];
    msgs: MessagePrimeNg[] = [];
    compteForm: any;
    public controlName: object = null;
    public submitted: boolean;
    public errorMessage = '';
    public errorbirthMessage = '';
    public errorbirthCoMessage = '';
    public errorConfirmPwdMessage = '';
    public errorObtinMessage = '';
    public termePseudoInterditMessage = '';
    public termeMailInterditMessage = '';
    public uid = '';
    public allStepCompleted = false;
    public isCouple = false;
    public vousetes: any[];
    public pseudos: any[];
    public pseudosForbidden: any[];
    public mailsForbidden: any[];
    public tchatsForbidden: any[];
    public selectedVe: any;
    public estCouple = false;
    public inscriptionisValid = false;

    confirmpasswordCtrl = 'confirmpassword';
    cityLiteralCtrl = 'city';

    cguConfirmessage: string;
    currentIncription: Inscription;

    minorNotAutorized: string;
    pseudoNotAutorized: string;
    mailNotAutorized: string;
    dateInvalid: string;
    minorMessage: string;
    errorsOnSubscribe = [];
    emailError = '';
    pseudoError = '';
    paysError= '';
    villeError= '';
    inscription: any;
    pendingMessageEmail = 'Continuer';
    constructor(
        private appConfig: AppConfig,
        private countryApplicatifService: CountryApplicatifServiceACI,
        private pseudoApplicatifService: PseudoApplicatifServiceACI,
        private sharedDataService: SharedDataService,
        private pseudoValidationService: PseudoValidationService,
        private utilityFactory: UtilityFactory,
        private inscriptionFactory: InscriptionFactory,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private formBuilder: FormBuilder,
        private inscriptionApplicatifServiceACI: InscriptionApplicatifServiceACI,
        private administrationApplicatifService: AdministrationApplicatifServiceACI,
        private messageService: MessageService,
    ) {
        this.sharedDataService.getEtapeInscription()
            .subscribe(etape => {
                if (etape < 8) {
                    this.router.navigate(['/splashcreen']);
                }
            });

        this.initializeControleName();
        this.sharedDataService.inscriptionsteps.subscribe(inscriptionsteps => {
            const etapes = inscriptionsteps.etapes;
            const etape = etapes.find((item) => item.etape === 'etape1');
            this.vousetes = etape.value;
            this.sharedDataService.errorsOnSubscribe.subscribe(errors => {
                this.errorsOnSubscribe = errors;
            });
            this.sharedDataService.processinscriptionsteps.subscribe(inscription => {
                this.inscription = inscription;
                if (inscription.id_vsetes) {

                    const selectedVe = etape.value.find((item) => item.id === inscription.id_vsetes);
                    if (selectedVe && selectedVe.label && selectedVe.label.toLocaleLowerCase().indexOf('couple') !== -1) {
                        this.isCouple = true;
                    }
                }


                if ((this.isCouple || inscription.id_orientation) && inscription.id_pratique && inscription.id_pratique.length &&
                    inscription.id_recherche /*&& inscription.id_situation*/ &&
                    inscription.id_statut && inscription.id_tendance &&
                    inscription.id_vsetes) {
                    this.allStepCompleted = true;
                }
                if (inscription) {
                    this.currentIncription = this.inscriptionFactory.inscriptionFromAny(inscription);

                    this.selectedVe = this.vousetes.find((item) => item.id === inscription.id_vsetes);
                    if (this.selectedVe && this.selectedVe.label && this.selectedVe.label.toLocaleLowerCase().indexOf('couple') !== -1) {
                        this.estCouple = true;
                        this.compteForm = this.formBuilder.group({
                            'pays': ['', Validators.required],
                            'city': [],
                            'pseudo': ['', [Validators.required,ValidationService.DeuxPremierAlphabet,ValidationService.pseudoValidator,
                            this.isPseudoExcluded.bind(this),ValidationService.lengthValidator,
                            ValidationService.AccentValidator, ValidationService.pseudoSpecialCharValidator]],
                            'email': ['', [Validators.required, ValidationService.emailValidator]],
                            'password': ['', [Validators.required, ValidationService.pseudoSpecialCharValidator]],
                            'confirmpassword': ['', [Validators.required, ValidationService.pseudoSpecialCharValidator]],
                            'birthDay': ['', [Validators.required]],
                            'birthMonth': ['', [Validators.required, ValidationService.monthValidator]],
                            'birthYear': ['', [Validators.required, ValidationService.yearValidator, ValidationService.MajorityValidator]],
                            'birthCoDay': ['', [Validators.required]],
                            'birthCoMonth': ['', [Validators.required, ValidationService.monthValidator]],
                            'birthCoYear': ['', [Validators.required, ValidationService.yearValidator, ValidationService.MajorityValidator]]
                        });
                        this.compteForm.setValidators([ValidationService.MatchPassword,
                            ValidationService.DayValidator, ValidationService.DayConjointValidator]);
                    } else {
                        this.compteForm = this.formBuilder.group({
                            'pays': ['', Validators.required],
                            'city': [],
                            'pseudo': ['', [Validators.required,ValidationService.DeuxPremierAlphabet,ValidationService.pseudoValidator,
                            this.isPseudoExcluded.bind(this),ValidationService.lengthValidator,
                            ValidationService.AccentValidator, ValidationService.pseudoSpecialCharValidator]],
                            'email': ['', [Validators.required, ValidationService.emailValidator]],
                            'password': ['', [Validators.required, ValidationService.pseudoSpecialCharValidator]],
                            'confirmpassword': ['', [Validators.required, ValidationService.pseudoSpecialCharValidator]],
                            'birthDay': ['', [Validators.required]],
                            'birthMonth': ['', [Validators.required, ValidationService.monthValidator]],
                            'birthYear': ['', [Validators.required, ValidationService.yearValidator, ValidationService.MajorityValidator]]
                        });
                        this.compteForm.setValidators([ValidationService.MatchPassword, ValidationService.DayValidator])
                    }
                }
            });

            // this.compteForm.valueChanges.subscribe(d=>{
            //     console.log(this.compteForm);
            // });

            this.filteredCities = this.compteForm.controls[this.cityLiteralCtrl].valueChanges
                .debounceTime(700)
                .startWith(null)
                .filter(name => name === null || typeof name === 'string')
                .flatMap(name => this.countryApplicatifService.getFranceCity('france', name));

            this.compteForm.valueChanges.subscribe(data => {
                this.errorConfirmPwdMessage = '';
                this.submitted = false;
                this.errorObtinMessage = '';
                this.termePseudoInterditMessage = '';
                this.termeMailInterditMessage = '';
            })

            this.filteredCountries = this.compteForm.controls['pays'].valueChanges
                .debounceTime(700)
                .startWith(null)
                .filter(name => name === null || typeof name === 'string')
                .flatMap(name => this.countryApplicatifService.getCountry(name));
        });

    }
  
    initializeControleValue(controleName: string, controleValue) {
        if (this.compteForm !== undefined) {
            const currentControl = this.compteForm.controls[controleName];
            if (currentControl && controleValue) {
                currentControl.setValue(controleValue);
            }
        }
    }
    initializeDateNaissance(isConjoint: boolean, dateNaissance: string) {
        if (dateNaissance && dateNaissance.indexOf('-') !== -1) {
            const dateNaissances = dateNaissance.split('-');
            if (dateNaissances.length === 3) {
                if (!isConjoint) {
                    this.initializeControleValue('birthDay', dateNaissances[2]);
                    this.initializeControleValue('birthMonth', dateNaissances[1]);
                    this.initializeControleValue('birthYear', dateNaissances[0]);
                } else {
                    this.initializeControleValue('birthCoDay', dateNaissances[2]);
                    this.initializeControleValue('birthCoMonth', dateNaissances[1]);
                    this.initializeControleValue('birthCoYear', dateNaissances[0]);
                }
            }
        }
    }
    initializeControleName() {
        const controlNameConfig: object = {
            'pays': 'pays',
            'city': 'city',
            'pseudo': 'pseudo',
            'email': 'email',
            'password': 'mot de passe',
            'confirmpassword': 'confirmation  mot de passe',
            'datenaissance': 'date de naissance',
            'birthDay': 'jour',
            'birthMonth': 'mois',
            'birthYear': 'année',
            'birthCoDay': 'jour',
            'birthCoMonth': 'mois',
            'birthCoYear': 'année',
            'datenaissanceconjoint': 'date de naissance conjoint'
        }
        this.controlName = controlNameConfig;
    }

    filterCities(val: string) {
        if (val) {
            const filterValue = val.toLowerCase();
            return this.cities.filter(city => city.commune.toLowerCase().startsWith(filterValue));
        }
        return this.cities;
    }

    displayCityFn(value: any): string {
        return value && typeof value === 'object' ? value.commune : value;
    }

    displayCountryFn(value: any): string {
        return value && typeof value === 'object' ? value.name : value;
    }

    cityAutocompleteSelected(event: MdOptionSelectionChange, city: City) {
        if (event.source.selected) {
            this.selectedCity = city;
            this.villeError = '';
        }
    }

    autocompleteSelected(event: MdOptionSelectionChange, country: Country) {
        if (event.source.selected) {
            this.paysError = '';
            this.selectedCountry = country;
            if (this.selectedCountry.code === 'FRA') {
                this.compteForm.controls[this.cityLiteralCtrl].setValidators([Validators.required]);
            } else {
                this.compteForm.controls[this.cityLiteralCtrl].clearValidators();
                this.compteForm.controls[this.cityLiteralCtrl].updateValueAndValidity();
            }
        }
    }

    verifyConfirmPassword(): void {
        if (this.compteForm.controls[this.confirmpasswordCtrl].value.length === 0) {
            this.errorMessage = 'Veuillez remplir correctement les champs';
            this.compteForm.controls[this.confirmpasswordCtrl].setErrors({ 'required': true });
            // tslint:disable-next-line:no-unused-expression
            this.compteForm.controls[this.confirmpasswordCtrl].markAsTouched;
        }
    }

    ngOnInit() {
        this.title = 'Comptes';
        this.translate.get('cguConfirm').subscribe((res: string) => {
            this.cguConfirmessage = res;
        });
        this.administrationApplicatifService.listTermes().subscribe(termes => {
            this.pseudosForbidden = termes.value.filter(term => term.pseudo);
            this.mailsForbidden = termes.value.filter(term => term.profil);
            this.tchatsForbidden = termes.value.filter(term => term.tchat);
        });
        this.pseudoApplicatifService.getPseudo().subscribe(res => {
            this.pseudos = res;
        });
        this.translate.get('pseudoNotAutorized').subscribe((res: string) => {
            this.pseudoNotAutorized = res;
        });
        this.translate.get('mailNotAutorized').subscribe((res: string) => {
            this.mailNotAutorized = res;
        });
        this.translate.get('minorNotAutorized').subscribe((res: string) => {
            this.minorNotAutorized = res;
        });
        this.translate.get('dateInvalid').subscribe((res: string) => {
            this.dateInvalid = res;
        });

        this.translate.get('minorMessage').subscribe((res: string) => {
            this.minorMessage = res;
        });

        if (this.currentIncription) {
            this.initializeControleValue('pseudo', this.currentIncription.pseudo);
            this.initializeControleValue('email', this.currentIncription.email);
            this.initializeControleValue('password', this.currentIncription.password);
            this.initializeControleValue('confirmpassword', this.currentIncription.passwordconfirm);

            this.isObtinChecked = this.currentIncription.obtin;

            if (this.currentIncription.pays) {
                this.countryApplicatifService
                    .getCountryIso(this.currentIncription.pays)
                    .subscribe(country => {
                        this.selectedCountry = country[0];
                        this.initializeControleValue('pays', country[0].name);
                        this.compteForm.markAsDirty();
                    });

            }

            if (this.currentIncription.date_naissance) {
                this.initializeDateNaissance(false, this.currentIncription.date_naissance);
            }

            if (this.currentIncription.date_naissance_c) {
                this.initializeDateNaissance(true, this.currentIncription.date_naissance_c);
            }

        }
    }

    isPseudoExcluded(control: FormControl) {
        // let isInvalidPseudo = false;
        let pseudoValidation =  {
            excluded: false,
            message : []
        };
        if (control.value !== '') {
            const pseudo = control.value;
            const pseudoLower = pseudo.toLocaleLowerCase();
            if (this.pseudosForbidden) {
                /* const exludedFilter = this.pseudosForbidden.findIndex(excluded =>
                    pseudoLower.indexOf(excluded.value.trim().toLocaleLowerCase()) !== -1); */
                const exludedFilter = this.pseudosForbidden.filter(excluded =>
                    pseudoLower.includes(excluded.value.trim().toLocaleLowerCase()));
                pseudoValidation =  {
                        excluded:  exludedFilter.length > 0,
                        message : exludedFilter
                    };
                /* if (exludedFilter !== -1) {
                    pseudoValidation =  {
                        excluded: true,
                        message : this.pseudosForbidden[exludedFilter].value
                    };
                } */
            }
        }
        if (pseudoValidation.excluded) {
            // const pseudoNotAutorized =  ` ${this.pseudoNotAutorized} Il contient le mot ${pseudoValidation.message} `;
            const pluriel = pseudoValidation.message.length === 1 ? '' : 's';
            const pseudoNotAutorized =  ` ${this.pseudoNotAutorized}. 
                Il contient le${pluriel} mot${pluriel} "${pseudoValidation.message.map(res => res.value).join('", "')}". `;

            const res = {};
            res[pseudoNotAutorized] = true;
            control.setErrors(res);

            return res;
        }

        return undefined;
    }
    verifyPays() {
        const isPaysExcluded = false;
        const pays = this.compteForm.controls['pays'].value;
        if (pays) {
            this.paysError = pays.id ? '' : 'Pays invalide';
        } else {
            this.paysError = '';
        }


    }
    verifyVille() {
        const isPaysExcluded = false;
        const ville = this.compteForm.controls[this.cityLiteralCtrl].value;
        if (ville) {
            this.villeError = ville.id ? '' : 'Ville invalide';
        } else {
            this.villeError = '';
        }

    }

    verifyPseudoIfExist() {
        const dataToVerify = {
            pseudo: this.compteForm.controls['pseudo'].value,
            email: '',
            idsite: this.appConfig.getSiteIdByLocation()
        };
        this.verifyDatas(dataToVerify, false);
    }

    getInputColor(name) {
        let color = '';
        switch (name){
            case 'mail' : color =  this.emailError.length !== 0 ? 'red' : ''; break;
            case 'pseudo' :  color = this.pseudoError.length !== 0 ? 'red' : ''; break;
            case 'ville' :  color =  this.villeError.length !== 0 ? 'red' : ''; break;
            case 'pays' :  color =  this.paysError.length !== 0 ? 'red' : ''; break;
        }
        return color;
    }

    verifyEmailIfExist() {
        this.compteForm.controls['email'].setValue(this.compteForm.controls['email'].value.toLowerCase());
        const dataToVerify = {
            pseudo: '',
            email: this.compteForm.controls['email'].value,
            idsite: this.appConfig.getSiteIdByLocation()
        };
        this.verifyDatas(dataToVerify, true);
    }

    verifyDatas(dataToVerify: any, isEmail: boolean) {
        this.inscriptionApplicatifServiceACI.verifyUserDatas(dataToVerify)
            .subscribe(res => {
                if (res.exist && isEmail) {
                    this.emailError = 'Email déjà existant dans ce site';
                } else if (res.exist) {
                    this.pseudoError = 'Pseudo déjà existant dans ce site';
                } else if (isEmail) {
                    this.emailError = '';
                } else {
                    this.pseudoError = '';
                }
            },
            err => {
                console.log(err);
            });
    }

    emailToLowerCase(event): void {
        console.log(event);
        if (event.keyCode !== 46 && event.keyCode !== 37) {
            console.log(this.compteForm.controls['email'].value.toLowerCase());
            this.compteForm.controls['email'].setValue(this.compteForm.controls['email'].value.toLowerCase());
        }
    }

    

    toogleObtin() {
        this.isObtinChecked = !this.isObtinChecked;
    }
    public showInputValidation() {
        Object.keys(this.compteForm.controls).forEach(control => {
            this.compteForm.controls[control].markAsTouched();
        });
    }

    setTwoDigit(controlName: string, controlValue: string) {
        const selectedControl = this.compteForm.controls[controlName];
        if (selectedControl) {
            if (selectedControl.value.length < 2) {
                selectedControl.setValue(this.utilityFactory.twoDigit(controlValue));
            }
        }
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
    public MarkAsMinorNotValid(errorMessage, isConjoint) {

        if (!isConjoint) {
            this.compteForm.controls['birthYear'].setErrors({ 'minorNotAutorized': true });
            // tslint:disable-next-line:no-unused-expression
            this.compteForm.controls['birthYear'].markAsTouched;
        } else {
            this.compteForm.controls['birthCoYear'].setErrors({ 'minorNotAutorized': true });
            // tslint:disable-next-line:no-unused-expression
            this.compteForm.controls['birthCoYear'].markAsTouched;
        }

    }
    private setBirthErrorMessage(isConjoint, errorMessage) {
        if (!isConjoint) {
            this.errorbirthMessage = errorMessage;
        } else {
            this.errorbirthCoMessage = errorMessage;
        }
    }

    private checkDateIsValid(isConjoint: boolean, birthDayControl: string, birthMonthControl: string, birthYearControl: string) {
        let isValid = true;
        const messageConjoint = isConjoint ? ' conjoint' : '';
        const dateNaissance = isConjoint ? this.dateNaissanceConjoint : this.dateNaissance;

        if (dateNaissance !== undefined) {
            if (!ValidationFactoryService.isdateValid(this.compteForm.controls[birthDayControl].value,
                this.compteForm.controls[birthMonthControl].value,
                this.compteForm.controls[birthYearControl].value)) {
                this.setBirthErrorMessage(isConjoint, this.dateInvalid);
                isValid = false;
            } else {
                if (this.utilityFactory.isFutureDate(this.compteForm.controls[birthDayControl].value,
                    this.compteForm.controls[birthMonthControl].value,
                    this.compteForm.controls[birthYearControl].value)) {
                    this.setBirthErrorMessage(isConjoint, this.dateInvalid);
                    isValid = false;
                } else {
                    const isMajor = this.utilityFactory.calculateAge(this.compteForm.controls[birthDayControl].value,
                        this.compteForm.controls[birthMonthControl].value,
                        this.compteForm.controls[birthYearControl].value);
                    if (!isMajor) {
                        this.MarkAsMinorNotValid(this.minorNotAutorized, isConjoint);
                        this.setBirthErrorMessage(isConjoint, this.minorNotAutorized);
                        isValid = false;
                    }
                }

            }
        } else {
            this.MarkAsMinorNotValid('', isConjoint);
            this.setBirthErrorMessage(isConjoint, this.dateInvalid);
            isValid = false;
        }
        return isValid;
    }


    public processInscription() {
        let isValid = true;
        this.submitted = true;
        this.errorMessage = '';
        this.errorbirthMessage = '';
        this.errorbirthCoMessage = '';

        this.pendingMessageEmail = 'Envoi d\'email en cours..';
        if (this.compteForm.controls['confirmpassword'].value.length === 0) {
            // this.errorMessage = 'Veuillez remplir correctement les champs';
            this.compteForm.controls['confirmpassword'].setErrors({ 'required': true });
            // tslint:disable-next-line:no-unused-expression
            this.compteForm.controls['confirmpassword'].markAsTouched;
            isValid = false;
        }
        if (this.paysError.length !== 0 || this.villeError.length !== 0) {
            isValid = false;
        }

        if (this.selectedCountry === undefined) {
            this.showInputValidation();
            // this.errorMessage = 'Veuillez remplir correctement les champs';
            this.compteForm.controls['pays'].setErrors({ 'invalidCodePays': true });
            // tslint:disable-next-line:no-unused-expression
            this.compteForm.controls['pays'].markAsTouched;
            isValid = false;
        }

        if (!this.compteForm.controls['birthDay'].invalid &&
            !this.compteForm.controls['birthMonth'].invalid &&
            !this.compteForm.controls['birthYear'].invalid
        ) {
            this.setTwoDigit('birthDay', this.compteForm.controls['birthDay'].value);
            this.setTwoDigit('birthMonth', this.compteForm.controls['birthMonth'].value);

            this.dateNaissance = this.compteForm.controls['birthYear'].value + '-' +
                this.compteForm.controls['birthMonth'].value + '-' +
                this.compteForm.controls['birthDay'].value;

        }

        if (this.estCouple && !this.compteForm.controls['birthCoDay'].invalid &&
            !this.compteForm.controls['birthCoMonth'].invalid &&
            !this.compteForm.controls['birthCoYear'].invalid
        ) {

            this.setTwoDigit('birthCoDay', this.compteForm.controls['birthDay'].value);
            this.setTwoDigit('birthCoMonth', this.compteForm.controls['birthCoMonth'].value);

            this.dateNaissanceConjoint = this.compteForm.controls['birthCoYear'].value + '-' +
                this.compteForm.controls['birthCoMonth'].value + '-' +
                this.compteForm.controls['birthCoDay'].value;

        }

        if (!this.compteForm.dirty || !this.compteForm.valid) {
            this.showInputValidation();
            // this.errorMessage = 'Veuillez remplir correctement les champs';
            isValid = false;
        }

        if (!this.allStepCompleted) {
            this.errorMessage = 'vous avez sauter des étapes d\'inscription';
            isValid = false;
        }

        if (isValid && !this.checkDateIsValid(false, 'birthDay', 'birthMonth', 'birthYear')) {
            isValid = false;
        }

        if (isValid && this.estCouple && !this.checkDateIsValid(true, 'birthCoDay', 'birthCoMonth', 'birthCoYear')) {
            isValid = false;
        }

        if (!this.isObtinChecked) {
            this.errorObtinMessage = this.cguConfirmessage;
            isValid = false;
        }

        if (!isValid) {
            this.pendingMessageEmail = 'Continuer';
            return;
        }

        if (this.compteForm.dirty && this.compteForm.valid) {
            const email = this.compteForm.value.email;
            const password = this.compteForm.value.password;
            this.inscription.pseudo = this.compteForm.value.pseudo;
            this.inscription.email = this.compteForm.value.email;
            this.inscription.pays = this.selectedCountry ? this.selectedCountry.code : '';
            if (this.selectedCity && this.selectedCity.cp) {
                this.inscription.ville = this.selectedCity.cp;
                this.inscription.lat = this.selectedCity.lat;
                this.inscription.lon = this.selectedCity.lon;
                this.inscription.villeName = this.selectedCity.region;
                this.inscription.villeFullName = this.selectedCity.commune;
            }
            this.inscription.date_naissance = this.dateNaissance;
            if (this.dateNaissanceConjoint) {
                this.inscription.date_naissance_c = this.dateNaissanceConjoint;
            }
            this.inscription.password = this.compteForm.value.password;
            this.inscription.passwordconfirm = this.compteForm.value.confirmpassword;
            this.inscription.obtin = this.isObtinChecked;
            const dataToVerify = {
                pseudo: this.inscription.pseudo,
                email: this.inscription.email,
                idsite: this.appConfig.getSiteIdByLocation()
            };
            this.inscriptionApplicatifServiceACI.verifyUserDatas(dataToVerify)
                .subscribe(res => {
                    if (res.exist) {
                        this.pendingMessageEmail = 'Continuer';
                        this.inscriptionisValid = false;
                        this.inscriptionApplicatifServiceACI.postInscription(this.inscription).subscribe(
                            res => {
                                this.errorsOnSubscribe = res.error;
                            },
                            err => {
                                console.log(err);
                            });
                    } else {
                        // this.sharedDataService.setEtapeInscription(9);
                        // this.router.navigate(['/inscription/inscriptionConfirm']);
                        this.sendEmail();
                    }
                },
                err => {
                    console.log(err);
                });
        }
    }

    finalizeInscription(): void {
        if (this.inscriptionisValid) {
            this.sharedDataService.setEtapeInscription(9);
            this.sharedDataService.uid.next(this.uid);
            this.router.navigate(['/inscription/inscriptionConfirm']);
        }
    }

    sendEmail(): void {
        this.errorsOnSubscribe = [];
        this.errorMessage = '';
        this.inscriptionApplicatifServiceACI.getIp().subscribe(address => {
            this.inscription.ip = address.ip;
            this.subscribe();
        });
    }

    dayOrMonthChange(field): void {
        this.errorbirthMessage = '';
        this.errorbirthCoMessage = '';
        const d = this.compteForm.controls[field].value * 1;
        const c = field === 'birthDay' || field === 'birthCoDay' ?
            d >= 4 : (field === 'birthMonth' || field === 'birthCoMonth' ? d >= 2 : true);
        if (this.compteForm.controls[field].value.length === 2 || c) {
            switch (field) {
                case 'birthDay':
                    this.monthDay.nativeElement.focus();
                    break;
                case 'birthMonth':
                    this.yearBirth.nativeElement.focus();
                    break;
                case 'birthCoDay':
                    this.monthDayC.nativeElement.focus();
                    break;
                case 'birthCoMonth':
                    this.yearBirthC.nativeElement.focus();
                    break;
                default:
                    break;
            }
        }
    }


    uncapitalizeFirstLetter(field): void {
        this.emailError = '';
        if (this.compteForm.controls[field].value.length === 1) {
            field === 'email' ?
                this.email.nativeElement.value = this.compteForm.controls[field].value.toLowerCase() :
                this.pseudo.nativeElement.value = this.compteForm.controls[field].value.toLowerCase();
        }
    }

    subscribe(): void {
        this.inscriptionApplicatifServiceACI.postInscription(this.inscription).subscribe(inscription => {
            this.pendingMessageEmail = 'Continuer';
            let hasError = false;
            let informationMessage = 'Un email vous a été envoyé, pour terminer votre inscription';
            if (inscription) {
                if (inscription.status === 200) {
                    console.log('INSCRIPTION OK');
                    console.log(inscription);
                    this.uid = inscription.result['uid'];
                    this.inscriptionisValid = true;
                    this.finalizeInscription();
                } else {
                    hasError = true;
                    this.inscriptionisValid = false;
                    if (inscription.error !== null) {
                        if (inscription.error instanceof Array) {
                            const errMessage = inscription.error[0].message !== undefined ?
                                inscription.error[0].message : inscription.error[0];
                            this.errorCallback(errMessage);
                        } else {
                            this.errorCallback(inscription.error);
                        }
                    } else {
                        informationMessage = 'Votre inscription a échoué.';
                    }
                }
            }
        }, err => {
            this.errorCallback(err);
        });
    }

    errorCallback(err): void {
        this.pendingMessageEmail = 'Continuer';
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    annulerInscription(): void {
        if (!this.compteForm.controls['birthDay'].invalid &&
            !this.compteForm.controls['birthMonth'].invalid &&
            !this.compteForm.controls['birthYear'].invalid
        ) {
            this.setTwoDigit('birthDay', this.compteForm.controls['birthDay'].value);
            this.setTwoDigit('birthMonth', this.compteForm.controls['birthMonth'].value);
            this.dateNaissance = this.compteForm.controls['birthYear'].value + '-' +
                this.compteForm.controls['birthMonth'].value + '-' +
                this.compteForm.controls['birthDay'].value;
        }
        if (this.estCouple && !this.compteForm.controls['birthCoDay'].invalid &&
            !this.compteForm.controls['birthCoMonth'].invalid &&
            !this.compteForm.controls['birthCoYear'].invalid
        ) {
            this.setTwoDigit('birthCoDay', this.compteForm.controls['birthDay'].value);
            this.setTwoDigit('birthCoMonth', this.compteForm.controls['birthCoMonth'].value);
            this.dateNaissanceConjoint = this.compteForm.controls['birthCoYear'].value + '-' +
                this.compteForm.controls['birthCoMonth'].value + '-' +
                this.compteForm.controls['birthCoDay'].value;
        }
        this.inscription.pseudo = this.compteForm.value.pseudo;
        this.inscription.email = this.compteForm.value.email;
        this.inscription.pays = this.selectedCountry.code;
        if (this.selectedCity && this.selectedCity.cp) {
            this.inscription.ville = this.selectedCity.cp;
            this.inscription.lat = this.selectedCity.lat;
            this.inscription.lon = this.selectedCity.lon;
        }
        this.inscription.date_naissance = this.dateNaissance;
        if (this.dateNaissanceConjoint) {
            this.inscription.date_naissance_c = this.dateNaissanceConjoint;
        }
        this.inscription.password = this.compteForm.value.password;
        this.inscription.passwordconfirm = this.compteForm.value.confirmpassword;
        this.inscription.obtin = this.isObtinChecked;
        this.inscription.canceled = true;
        this.sharedDataService.setprocessinscriptionsteps(this.inscription);
    }

}
