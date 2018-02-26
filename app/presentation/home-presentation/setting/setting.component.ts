import { Component, OnInit, Input } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home/home.applicatif.service.aci';
import { AutorisationService } from '../../../commun/autorisation.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { SharedService } from '../../../commun/shared-service';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { AppConfig } from '../../../contrainte/config/_app/app.config';

import {  ChatMucService } from '../../../commun';

import { InscriptionApplicatifServiceACI } from '../../../service/applicatif/inscription';

import { LogoutService } from '../../../commun/logout-service';


@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css', ]
})
export class SettingComponent implements OnInit {
    currentUser: any;
    updatePseudo: false;
    currentPseudo = '';
    currentEmail = '';
    pseudoExistMessage = '';
    currentField = '';
    isLoading= false;

    updateHasError = false;
    existingPseudo = false;
    pseudoVerified = false;
    findPseudo = false;

    blurField = '';
    haveSouscription = false;
    editingPseudo = false;
    editingEmail = false;
    @Input() showHeader= false;
    public currentSouscription: any;
    setting: any;
    dureeUnitData = {Y: 'an(s)'};
    public  autorisation;

    public pseudosForbidden: any[];
    public mailsForbidden: any[];
    public tchatsForbidden: any[];
    public invalidspecialChar: string
    public invalidAccent: string;
    public invalidePseudo : string;
    public deuxPremierAlphabet : string;

    pseudoNotAutorized: string;
    mailNotAutorized: string;
    errorEmailMessage = '';
    msgs: MessagePrimeNg[] = [];
    renderValue: boolean;

    errorPseudoMessage = '';
    errorMessage = '';
    constructor(  private bsModalRef : BsModalRef,
        private appConfig: AppConfig,
        private inscriptionApplicatifServiceACI: InscriptionApplicatifServiceACI,
        private messageService: MessageService,
        private sharedService: SharedService,
        private translate: TranslateService,
        private administrationApplicatifService: AdministrationApplicatifServiceACI,
        private modalService: BsModalService, private jwtHelper: JwtHelper,
         private homeApplicativeService: HomeApplicatifServiceACI,
         private chatMucService: ChatMucService,
         private logoutService: LogoutService,
        private router: Router,
        private autorisationService: AutorisationService) {
        const token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);
        this.translate.get('pseudoNotAutorized').subscribe((res: string) => {
            this.pseudoNotAutorized = res;
        });
        this.translate.get('mailNotAutorized').subscribe((res: string) => {
            this.mailNotAutorized = res;
        });
        this.translate.get('invalidspecialChar').subscribe((res: string) => {
            this.invalidspecialChar = res;
        });
        this.translate.get('invalidAccent').subscribe((res: string) => {
            this.invalidAccent = res;
        });

        this.translate.get('invalidPseudo').subscribe((res: string) => {
            this.invalidePseudo = res;
        });

        this.translate.get('premierAlphabetInvalid').subscribe((res: string) => {
            this.deuxPremierAlphabet = res;
        });

    }

    ngOnInit() {
        this.getuserDetail();
        this.changePseudo();
        this.autorisation = this.autorisationService.getAutorisation();
        this.getUserSetting();
        this.administrationApplicatifService.listTermes().subscribe(termes => {
            this.pseudosForbidden = termes.value.filter(term => term.pseudo);
            this.mailsForbidden = termes.value.filter(term => term.profil);
            this.tchatsForbidden = termes.value.filter(term => term.tchat);
        });
    }

    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    contactUs() {
        this.router.navigate(['/contactUs']);
    }



    openModalDeleteUser(): void {
            this.bsModalRef = this.modalService.show(ModalConfirmComponent);
            const modalComponent = this.bsModalRef.content as ModalConfirmComponent;
            const data = {
                'title': 'Confirmation suppression',
                'content': 'Voulez-vous vraiment supprimer votre compte ?'
            };
            modalComponent.model = data;
            modalComponent.afterModelLoad();
            modalComponent.out.subscribe((result) => {
                if (result.data) {
                    this.removeAccount();
                }
            });
    }

    removeAccount() {
        this.isLoading = false;
        const uid = this.currentUser.uid;
        const args = {'uid': uid};
        this.sharedService.setUserUidRoom = uid;
        this.administrationApplicatifService.deleteUser(args).subscribe(users => {
            this.isLoading = false;
            /* this.chatMucService.logout();
            this.sharedService.setTchatMessageCount = 0; */
            this.logoutService.logout();
            this.sharedService.setLogout = true;
            
        } , err => {
            this.errorMessage = err.message ? err.message : err;
            this.isLoading = false;
        });
    }

    goToHelp() {
        this.router.navigate(['/help/1']);
    }

    goTocgu() {
        this.router.navigate(['/cgu/1']);
    }

    getUserSetting(): void {
        this.homeApplicativeService.getSetting()
            .subscribe(
                res => {
                    this.setting = res;
                    this.currentPseudo = this.setting.pseudo;
                    this.currentEmail = this.setting.email;
                    this.getSouscription();
                    this.currentField = '';
                },
                err => {
                    console.log(err);
                }
            );
    }

    isMailExcluded(email: string) {
        let isInvalidMail = false;
        this.errorEmailMessage = '';
        if (email !== '') {
            const mail = email;
            const mailLower =  mail.toLocaleLowerCase();
            isInvalidMail = this.mailsForbidden.some(it => mailLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1);
        }
        if (isInvalidMail) {
            this.errorEmailMessage = this.mailNotAutorized;
        }
    }

    verifyPseudoExcluded(pseudoValue: string) {
        let pseudoValidation = {
            excluded: false,
            message: []
        };

        if (pseudoValue !== '') {
            const pseudo = pseudoValue;
            const pseudoLower = pseudo.toLocaleLowerCase();
            /* isInvalidPseudo = this.pseudosForbidden.some(it => pseudoLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1); */
            const exludedFilter = this.pseudosForbidden.filter(excluded =>
                pseudoLower.includes(excluded.value.trim().toLocaleLowerCase()));
            pseudoValidation = {
                excluded: exludedFilter.length > 0,
                message: exludedFilter
            };
            
        }

        return pseudoValidation;
    }
    isPseudoExcluded(pseudoValue: string) {
        this.errorPseudoMessage = '';
        /* const pseudoValidation = {
            excluded: false,
            message: []
        }; */
        const premiereLettre = /^[a-zA-Z]+.{0,10}$/;
        if (!pseudoValue.match(premiereLettre)) {
            this.errorPseudoMessage = this.deuxPremierAlphabet;

            return  null ;
        }
        const pseudoValidation = this.verifyPseudoExcluded(pseudoValue);
        if (pseudoValidation.excluded) {
            const pluriel = pseudoValidation.message.length === 1 ? '' : 's';
            const pseudoNotAutorized = ` ${this.pseudoNotAutorized}. 
                    Il contient le${pluriel} mot${pluriel} "${pseudoValidation.message.map(res => res.value).join('", "')}". `;
            this.errorPseudoMessage = pseudoNotAutorized;

            return  null ;
        }

        const acceentPattern = /[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+/gi;
        if (pseudoValue.match(acceentPattern)) {
            this.errorPseudoMessage = this.invalidAccent;

            return  null ;
        }

        const acceentPatternpsedo = /[$&+,:;=?@#|'"<>^*()%!]+/gi;
        if (pseudoValue.match(acceentPatternpsedo)) {
            this.errorPseudoMessage = this.invalidspecialChar;

            return  null ;
        }
        const pseudoInvalid = /^[a-zA-Z]+[a-zA-Z0-9]+.{0,10}$/;
        if (!pseudoValue.match(pseudoInvalid)) {
            this.errorPseudoMessage = this.invalidePseudo;

            return  null ;
        }

        return null;
    }

    goToSouscription(): void{
        this.router.navigate(['/home/souscription']);
    }

    getSouscription(): void {
        const uid = this.currentUser.uid;
        this.homeApplicativeService.getCurrentSouscription(uid)
            .subscribe(
            res => {
                if (res.status !== 'NO_SOUSCRIPTION') {
                    this.gestionDaffichageSouscripActif(res.souscription);
                }
            },
            err => {
                console.log(err);
            });
    }

    openModalConfirmPseudo(field): void {
        this.isPseudoExcluded(this.currentPseudo);
        if (this.errorPseudoMessage.length > 0) {
            this.errorCallback(this.errorPseudoMessage);
        } else {
            this.bsModalRef = this.modalService.show(ModalConfirmComponent);
            const modalComponent = this.bsModalRef.content as ModalConfirmComponent;
            const data = {
                'title': 'Confirmation modification',
                'content': 'Voulez-vous vraiment changer votre pseudo ?'
            };
            modalComponent.model = data;
            modalComponent.afterModelLoad();
            modalComponent.out.subscribe((result) => {
                if (result.data) {
                    this.updatePseudoAndEmail(field);
                }
            });
        }
    }

    pseudoIsValid(field): boolean {
        let res = true;
        if (field === 'pseudo' && (this.currentPseudo.length < 2 || this.currentPseudo.length > 12)){
            this.errorCallback('Le champ pseudo doit être entre 2 et 12 caractères alphanumériques');
            res = false;
        }
        if (this.existingPseudo) {
            res = false;
            this.editingPseudo = true;
            this.pseudoExistMessage = 'Pseudo déjà existant dans ce site.';
        }
        return res;
    }

    updatePseudoAndEmail(field): void {
        const pseudoIsValid = this.pseudoIsValid(field);
        field === 'pseudo' ?  this.editingPseudo = !this.editingPseudo : this.editingEmail = !this.editingEmail;
        let letUpdate = field === 'email' ? this.setting.email !== this.currentEmail : this.setting.pseudo !== this.currentPseudo;

        if (this.updateHasError) {
            letUpdate = true;
        }
        letUpdate = letUpdate && pseudoIsValid;
        if (letUpdate) {
            this.currentField = field;
            this.setting.pseudo = this.currentPseudo;
            this.setting.email = this.currentEmail;
            this.homeApplicativeService.updatePseudoEmail(this.currentPseudo, this.currentEmail).subscribe(oUser => {
                if (oUser.json().status && oUser.json().status !== 200) {
                    const errorMsg = oUser.json().error && oUser.json().error[0] ? oUser.json().error[0] : 'Pseudo déjà existant';
                    this.errorCallback(errorMsg);
                    this.currentField = 'pseudo';
                    this.updateHasError = true;
                } else {
                    this.updateHasError = false;
                    this.getUserSetting();
                    this.initEmailAndPseudoField();
                    if (field === 'email') {
                        sessionStorage.removeItem('id_token');
                        sessionStorage.removeItem('rfIuid');
                        sessionStorage.removeItem('allUnreadMessageCount');
                        this.router.navigate(['/login']);
                    } else {
                        this.sharedService.onUpdateSetting.next(this.setting.pseudo);
                    }
                }
                // reinitialising user detail
                this.changePseudo();
            }, err => {
                this.initEmailAndPseudoField();
                this.errorCallback('Une erreur venant du serveur est survenue');
            });
        } else if (pseudoIsValid){
            this.initEmailAndPseudoField();
        }
        if (!pseudoIsValid){
            this.editingPseudo = true;
        }
    }

    blurEmailAndPseudo(field: string): void{
        let letUpdate = field === 'email' ? this.setting.email !== this.currentEmail : this.setting.pseudo !== this.currentPseudo ;
        if (this.updateHasError) {
            letUpdate = true;
        }

        if (!letUpdate) {
          this.initEmailAndPseudoField();
        }
    }

    initEmailAndPseudoField(): void {
        this.currentField = '';
        this.blurField = '';
        this.editingPseudo = false;
        this.editingEmail = false;
        this.pseudoVerified = false;
    }

    editActive(): void {
        this.currentField = 'pseudo';
        this.blurField = 'pseudo';
        this.editingPseudo = true;
    }

    openConfirmModal() {
        const email = '';
        this.bsModalRef = this.modalService.show(ModalConfirmComponent);
        const modalComponent = this.bsModalRef.content as ModalConfirmComponent;
        const data = {
            'title': 'Confirmation modification',
            // tslint:disable-next-line:max-line-length
            'content': 'Voulez-vous vraiment changer votre email? Vous serez deconnecté et votre compte sera désactivé jusqu\'à ce que vousconfirmiez votre nouvel email.'
        };
        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                this.updatePseudoAndEmail('email');
            }
        });
    }

    goToBlacklist(): void{
         this.router.navigate(['/home/blacklist']);
    }

    formatDates(): void {
        if (this.currentSouscription.dateSouscription){
            this.currentSouscription.dateSouscription = this.currentSouscription.dateSouscription.split('-')[2] +
            '/' + this.currentSouscription.dateSouscription.split('-')[1] + '/' + this.currentSouscription.dateSouscription.split('-')[0];
        }
        if (this.currentSouscription.dateExpiration){
            this.currentSouscription.dateExpiration = this.currentSouscription.dateExpiration.split('-')[2] +
            '/' + this.currentSouscription.dateExpiration.split('-')[1] + '/' + this.currentSouscription.dateExpiration.split('-')[0];
        }
    }

    goToDeconection(): void {       
        this.logoutService.logout();
    }

    goToGestNotification(): void {
         this.router.navigate(['/home/notification']);
    }

    verifyPseudo(field){
        this.currentField = '';
        this.blurField = field;
    }

    pseudoExist() {
        if (this.currentPseudo !== this.setting.pseudo) {
            const dataToVerify = {
                pseudo: this.currentPseudo,
                email: '',
                idsite: this.appConfig.getSiteIdByLocation()
            };
            this.verifyDatas(dataToVerify);
        }
    }

    verifyDatas(dataToVerify: any) {
        this.findPseudo = true;
        this.pseudoExistMessage = '';
        this.inscriptionApplicatifServiceACI.verifyUserDatas(dataToVerify)
            .subscribe(res => {
                this.findPseudo = false;
                this.pseudoVerified = true;
                this.existingPseudo = res.exist;
                if (res.exist) {
                    this.pseudoExistMessage = 'Pseudo déjà existant dans ce site.';
                }
            },
            err => {
                this.findPseudo = false;
            });
    }

    changePseudo() {
        this.homeApplicativeService.getUserConnecte().subscribe(userConnecte => {
           this.updatePseudo = userConnecte.PseudoRejet;
        });
    }

    checkedOptions(event: any){
        this.isLoading = true;
        let checked = false;
        if (event.target.checked === false) {
            checked = true;
        }
        const uid = this.currentUser.uid;
        this.homeApplicativeService.subscribeNewsletter(uid, checked).subscribe(
            res => {
                if (res.status === 200) {
                    this.isLoading = false;
                } else {
                    this.isLoading = false;
                }
            },
            err => {
                this.isLoading = false;
                console.log(err);
        });
    }

    getuserDetail() {
        this.homeApplicativeService.getUserConnecte().subscribe(userDetail => {
                    console.log('users', userDetail.subscribed);
                    if (userDetail.subscribed === 1) {
                        this.renderValue = false;
                    } else {
                        this.renderValue = true;
                    }
        });
    }


    gestionDaffichageSouscripActif(currentSouscription){
        if(currentSouscription){
            for (let inscription of currentSouscription){
                if(inscription.statut=='ACTIF'){
                    this.currentSouscription = inscription;
                    break;
                }else if(inscription.statut=='RESILIE'){
                    this.currentSouscription = inscription;
                }else if(inscription.statut=='SUSPENDU'){
                    this.currentSouscription = inscription;
                }
            }
            if(this.currentSouscription.dureeUnit != undefined){
                this.currentSouscription.dureeUnit = this.dureeUnitData[this.currentSouscription.dureeUnit];
                this.formatDates();
            }
        }
        
    }

}
