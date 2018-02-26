import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { ActivatedRoute, Params } from '@angular/router';
import { Utilisateur } from '../../../donnee/home/utilisateur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Router, CanActivate } from '@angular/router';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { AutorisationService } from '../../../commun/autorisation.service';

import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { PhotoPdp } from '../../../commun/photo.pdp';
import { SharedService } from 'app/commun';
import { UtilsService } from 'app/commun/utils.service';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';


declare var $: any;

@Component({
    selector: 'app-modif-profil',
    templateUrl: './modif-profil.component.html',
    styleUrls: ['./modif-profil.component.css'],
    providers: [MessageService]
})
export class ModifProfilComponent implements OnInit {
    innerWidth: number;
    loading = false;
    msgs: MessagePrimeNg[] = [];
    percent = 0;
    settingIsChecked = false;

    @ViewChild('apparence') apparence;
    @ViewChild('apropos') apropos: ElementRef;
    @ViewChild('couleurcheveux') couleurcheveux;
    @ViewChild('couleuryeux') couleuryeux;
    @ViewChild('experience') inputexperience;
    @ViewChild('inputdisponibilite') inputdisponibilite;
    @ViewChild('inputmobilite') inputmobilite;
    @ViewChild('inputpratique') inputpratique;
    @ViewChild('look') look;
    @ViewChild('orientation') inputorientation;
    @ViewChild('origine') inputorigine;
    @ViewChild('poids') poids: ElementRef;
    @ViewChild('signepart') signepart;
    @ViewChild('silhouette') silhouette;
    @ViewChild('situation') inputsituation;
    @ViewChild('statut') statut;
    @ViewChild('taille') taille: ElementRef;
    @ViewChild('taillecheveux') taillecheveux;
    @ViewChild('tendance') inputtendance;

    signeData = {title: "Origine", value: [
        {id: "signelunette", label: "lunette", checked: false},
        {id: "signetatouage", label: "tatouage", checked: false},
        {id: "signepercing", label: "percing", checked: false},
        {id: "signecicatrice", label: "cicatrice", checked: false},
        {id: "signebarbe", label: "barbe", checked: false},
        {id: "signemoustache", label: "moustache", checked: false},
        ]};

    @Input() public oldUtilisateur: Utilisateur = new Utilisateur();
    @Input() public utilisateur: Utilisateur = new Utilisateur();
    // public selectedGame: Object = {};
    baseUrl = '';
    blurAboutMe= false;
    blurApparence= false;
    blurCouleurCheveux= false;
    blurDisponibilite= false;
    blurExperience= false;
    blurLook= false;
    blurMobilite= false;
    blurOrientation= false;
    blurPoid= false;
    blurPratique= false;
    blurSigne= false;
    blurSilhouette= false;
    blurStatut= false;
    blurTaille= false;
    blurTailleCheveux= false;
    blurTendance= false;
    blurYeux= false;
    currentField= '';
    editAboutMe= false;
    editApparence= false;
    editCouleurCheveux= false;
    editDisponibilite= false;
    editExperience= false;
    editLook= false;
    editMobilite= false;
    editOrientation= false;
    editOrigine= false;
    editPoid= false;
    editPratique= false;
    editSigne= false;
    editSilhouette= false;
    editSituation= false;
    editStatut= false;
    editTaille= false;
    editTailleCheveux= false;
    editTendance= false;
    editYeux= false;
    field= '';
    modifForm: any;
    nbPhotos: number;
    public albumChoice = true;
    public autorisation: any;
    public controlName: object = null;
    public currentIndex: number;
    public disabledApparence = false;
    public disabledCouleurCheveux = false;
    public disabledDisponibilite = false;
    public disabledEmail = false;
    public disabledExperience = false;
    public disabledLook = false;
    public disabledMobilite = false;
    public disabledOrientation = false;
    public disabledOrigine = false;
    public disabledPoid = false;
    public disabledPratiques = false;
    public disabledPropo = false;
    public disabledPseudo = false;
    public disabledSigne = false;
    public disabledSilhouette = false;
    public disabledSituation = false;
    public disabledStatut = false;
    public disabledTaille = false;
    public disabledTailleCheveux = false;
    public disabledTendances = false;
    public disabledYeux = false;
    public enableField = '';
    public form: FormGroup;

    errorProfilMessage = '';
    pseudoNotAutorized: string;
    profilNotAutorized: string;

    /* public pseudosForbidden: any[]; */
    public profilsForbidden: any[];

    public imgApparence = '../../../assets/img/edit.png';
    public imgCouleurCheveux = '../../../assets/img/edit.png';
    public imgDisponibilite = '../../../assets/img/edit.png';
    public imgEmail = '../../../assets/img/edit.png';
    public imgExperience = '../../../assets/img/edit.png';
    public imgLook = '../../../assets/img/edit.png';
    public imgMobilite = '../../../assets/img/edit.png';
    public imgOrientation = '../../../assets/img/edit.png';
    public imgOrigine = '../../../assets/img/edit.png';
    public imgPoid = '../../../assets/img/edit.png';
    public imgPratiques = '../../../assets/img/edit.png';
    public imgPropo = '../../../assets/img/edit.png';
    public imgPseudo = '../../../assets/img/edit.png';
    public imgSigne = '../../../assets/img/edit.png';
    public imgSilhouette = '../../../assets/img/edit.png';
    public imgSituation = '../../../assets/img/edit.png';
    public imgStatut = '../../../assets/img/edit.png';
    public imgTaille = '../../../assets/img/edit.png';
    public imgTailleCheveux = '../../../assets/img/edit.png';
    public imgTendances = '../../../assets/img/edit.png';
    public imgYeux = '../../../assets/img/edit.png';

    public loadingPage = false;
    public nbPhoto: any = 0;
    public nbPhotoPriv: any = 0;
    public nbPhotoPub: any = 0;
    public nombre: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    public opacityApparence: any =  1.0;
    public opacityCouleurCheveux: any = 1.0;
    public opacityDisponibilite: any =  1.0;
    public opacityEmail: any =  1.0;
    public opacityExperience: any =  1.0;
    public opacityLook: any = 1.0;
    public opacityMobilite: any =  1.0;
    public opacityOrientation: any =  1.0;
    public opacityOrigine: any =  1.0;
    public opacityPoid: any = 1.0;
    public opacityPratiques: any =  1.0;
    public opacityPropo: any =  1.0;
    public opacityPseudo: any =  1.0;
    public opacitySigne: any = 1.0;
    public opacitySilhouette: any = 1.0;
    public opacitySituation: any =  1.0;
    public opacityStatut: any =  1.0;
    public opacityTaille: any = 1.0;
    public opacityTailleCheveux: any = 1.0;
    public opacityTendances: any =  1.0;
    public opacityYeux: any = 1.0;
    public orientation: string;
    public origine: string;
    public oUser: any = {};
    public photos?: any;
    public photosPriv: any;
    public photosPrivShow: string;
    public photosPub: any;
    public photosPubShow: string;
    public privePhoto = false;
    public publicPhoto = false;
    public searchText: string;
    public situation: string;
    public tendance: string;
    public uid: string;
    public user;
    public userDetail?: any;
    public userUpdate: any = {};
    selectApparence= false;
    selectCouleurCheveux= false;
    selectCouleurYeux= false;
    selectDisponibilite= false
    selectExperience= false;
    selectLook= false;
    selectMobilite= false
    selectOrientation= false;
    selectOrigine= false;
    selectPratique= false;
    selectSigne= false;
    selectSituation= false;
    selectStatut= false;
    selectTailleCheveux= false;
    selectTendance= false;


    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private administrationApplicatifService: AdministrationApplicatifServiceACI,
         private route: ActivatedRoute,
         private photoPdp: PhotoPdp,
        private appConfig: AppConfig,
        private translate: TranslateService,
        private sharedDataService: SharedDataService,
        private cdr: ChangeDetectorRef,
        public dialog: MdDialog,
        private router: Router,
        private bsModalRef : BsModalRef,
        private modalService: BsModalService,
        private autorisationService: AutorisationService,
        private sharedService: SharedService,
        private utilsService: UtilsService
    ) {

        this.translate.get('pseudoNotAutorized').subscribe((res: string) => {
            this.pseudoNotAutorized = res;
        });

        //
        this.translate.get('profilNotAutorized').subscribe((res: string) => {
            this.profilNotAutorized = res;
        });

        this.initializeControleName();
        this.modifForm = this.formBuilder.group({
            'statut': ['', Validators.required],
            'recherche': ['', Validators.required],
            'firstname': ['', Validators.required]
        });

       const getWindow = () => {
          return window.innerWidth;
       };

      window.onresize = () => {
          this.innerWidth = getWindow();
          this.cdr.detectChanges();
      };
    }

    showSetting(): void {
        this.settingIsChecked = true;
    }


    modifProfilInit() {
        this.homeApplicatifServiceACI.getUserConnecte().subscribe(userDetail => {
            console.log(userDetail);
            this.sharedService.onDescriptionIsRejected.next(true);
            this.userDetail = userDetail;
            this.uid = userDetail.uid;
            this.orientation = userDetail.orientation;
            if (!userDetail.photo) {
                if (userDetail.idVsEtes !== null) {
                    const profilePhoto = this.photoPdp.getPhotoPdp(userDetail.idVsEtes);
                    if (profilePhoto) {
                        userDetail.defaultpdp = profilePhoto.pdp;
                    } else {
                        userDetail.defaultpdp = 'assets/img/profil-default.png';
                    }
                } else {
                    userDetail.defaultpdp = 'assets/img/profil-default.png';
                }
            }
            if (this.userDetail.value) {
                this.initialisationUtilisateur(this.userDetail);
                userDetail.value[4].value.forEach(data => {
                    if (data.checked) {
                        this.tendance = data.label.toLowerCase();
                    }
                }, err => {

                });
                this.getSearch(userDetail);
            }           
            this.getPhotos(this.uid);  
            this.sharedDataService.setUserConnected(userDetail);         
        }, err => {
            console.log('getUserConnecte', err);
            this.loadingPage = false;
        });
    }
    ngOnInit() {
        this.loadingPage = true;

        this.administrationApplicatifService.listTermes().subscribe(termes => {
            this.profilsForbidden = termes.value.filter(term => term.profil);
        });
        this.setPercentInfo();
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
        this.autorisation = this.autorisationService.getAutorisation();
        this.route.params.forEach((params: Params) => {            
            setTimeout(() => {
                if (params['showSetting'] === '1') {
                    this.currentIndex = 2;
                    this.modifProfilInit();
                } else {
                    this.currentIndex = 0;
                    this.modifProfilInit();
                }
            });
        });
        this.innerWidth = window.innerWidth;
    }

    getPhotos(uid: string): void {
        this.homeApplicatifServiceACI.listePhoto(this.uid, 'PUBLIC').subscribe(photos => {
            if (photos[0]) {
                this.photosPubShow = photos[0].uri;
            }
            this.photosPub = photos;
            this.nbPhotoPub = photos.length;
            this.loadingPage = false;
        });
        this.homeApplicatifServiceACI.listePhoto(this.uid, 'PRIVATE').subscribe(photos => {
            if (photos[0]) {
                this.photosPrivShow = photos[0].uri;
            }
            this.photosPriv = photos;
            this.nbPhotoPriv = photos.length;
            this.loadingPage = false;
        });
    }

    setPercentInfo() {
        this.sharedService.stateProfil.subscribe(percent => {this.percent = percent; });
    }

    public getSearch(data){
        let searchId = '';
        // let text = sessionStorage.search;
        const text = localStorage.SearchText;
        data.value[6].value.map(_data => {


            if (_data.checked == true && _data.id != 'nesaitpasencoreslug') {
                searchId = 'pour ' + _data.label;
            }
        });
        if (text && text.length > 0) {
            this.searchText = text;
        } else {
            if (Object.keys(data).length > 0){
                switch (this.utilisateur.id_orientation){
                    case 'heteroslug' :
                        switch (data.vsetes){
                            case 'Femme' : this.searchText = 'Homme ' + searchId;
                                break;
                            case 'Homme' :  this.searchText = 'Femme ' + searchId;
                                break;
                        }
                        break;
                    case 'homolesbienneslug' :
                        switch (data.vsetes){
                            case 'Femme' : this.searchText = 'Femme ' + searchId;
                                break;
                            case 'Homme' :  this.searchText = 'Homme ' + searchId;
                                break;
                        }
                        break;
                    default : this.searchText = 'Homme et Femme ' + searchId;
                        break;
                }
            }
        }
    }

    errorCallback(err): void{
        this.msgs = [];
         this.msgs.push({ severity: 'error', summary: '', detail: err });
     }

    public showPublic() {
        this.publicPhoto = true;
        this.privePhoto = false;
        this.albumChoice = false;
        this.photos = this.photosPub;
        console.log('ddd', this.photos);
        this.nbPhoto = this.nbPhotoPub;
    }

    public showPrive() {
        this.publicPhoto = false;
        this.privePhoto = true;
        this.albumChoice = false;
        this.photos = this.photosPriv;
        //  console.log("ddd",this.photos);
        this.nbPhoto = this.nbPhotoPriv;

    }

    setFocus(field: string) {
        switch (field) {
            case 'statut':
                this.editStatut = true;
                setTimeout((event) => { this.statut.trigger.nativeElement.click(); });
                break;
            case 'apropos':
                this.editAboutMe = true;
                setTimeout((event) => { this.apropos.nativeElement.focus(); });
                break;
            case 'orientation':
                this.editOrientation = true;
                setTimeout(() => { this.inputorientation.trigger.nativeElement.click(); });
                break;
            case 'situation':
                this.editSituation = true;
                setTimeout(() => { this.inputsituation.trigger.nativeElement.click(); });
                break;
            case 'apparence':
                this.editApparence = true;
                setTimeout(() => { this.apparence.trigger.nativeElement.click(); });
                break;
            case 'origine':
                this.editOrigine = true;
               setTimeout(() => { this.inputorigine.trigger.nativeElement.click(); });
                break;
            case 'tendances':
                this.editTendance = true;
                setTimeout(() => { this.inputtendance.trigger.nativeElement.click(); });
                break;
            case 'experience':
                this.editExperience = true;
                setTimeout(() => { this.inputexperience.trigger.nativeElement.click(); });
                break;
            case 'mobilite':
                this.editMobilite = true;
                setTimeout(() => { this.inputmobilite.trigger.nativeElement.click();  });
                break;
            case 'taille':
                this.editTaille = true;
                setTimeout(() => { this.taille.nativeElement.focus(); });
                break;
            case 'poids':
                this.editPoid = true;
                setTimeout(() => { this.poids.nativeElement.focus(); });
                break;
            case 'signepart':
                this.editSigne = true;
                setTimeout(() => { this.signepart.trigger.nativeElement.click(); });
                break;
            case 'disponibilite':
                this.editDisponibilite = true;
                setTimeout(() => { this.inputdisponibilite.trigger.nativeElement.click();  });
                break;
            case 'pratiques':
                this.editPratique = true;
                setTimeout(() => { this.inputpratique.trigger.nativeElement.click(); });
                break;
            case 'couleurCheveux':
                this.editCouleurCheveux = true;
                setTimeout(() => { this.couleurcheveux.trigger.nativeElement.click(); });
                break;
            case 'tailleCheveux':
                this.editTailleCheveux = true;
                setTimeout(() => { this.taillecheveux.trigger.nativeElement.click(); });
                break;
            case 'couleurYeux':
                this.editYeux = true;
                setTimeout(() => { this.couleuryeux.trigger.nativeElement.click(); });
                break;
            case 'look':
                this.editLook = true;
                setTimeout(() => { this.look.trigger.nativeElement.click(); });
                break;
            default:
                break;
        }
    }

    public album() {
        this.photos = [];
        this.nbPhoto = 0;
        this.publicPhoto = false;
        this.privePhoto = false;
        this.albumChoice = true;
    }

    public data: any = {};

    deletePhoto(uri) {
        this.loading = true;
        this.data.uri = uri;

        this.homeApplicatifServiceACI.deletePhoto(this.data).subscribe(
            () => {
                this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
                    this.loading = false;
                    this.sharedDataService.setUserConnected(userConnecte);
                })
                if (this.publicPhoto) {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, true).subscribe(photos => {
                        this.photosPubShow = null;
                        if (photos[0]) {
                            this.photosPubShow = photos[0].uri;
                        }
                        this.photos = photos;
                        this.photosPub = photos;
                        this.nbPhoto = photos.length;
                        this.nbPhotoPub = this.nbPhotoPub - 1;
                    });
                }
                else {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, false).subscribe(photos => {
                        this.photosPrivShow = null;
                        if (photos[0]) {
                            this.photosPrivShow = photos[0].uri;
                        }
                        this.photos = photos;
                        this.photosPriv = photos;
                        this.nbPhoto = photos.length;
                        this.nbPhotoPriv = this.nbPhotoPriv - 1;
                    });
                }
            },
            err => {
                console.log(err);
            });

        //this.router.navigate(['/home/modifProfil']);
    }

    public openModalImageDelete(uri) {
        this.bsModalRef = this.modalService.show(ModalConfirmComponent);
        var modalComponent = this.bsModalRef.content as ModalConfirmComponent;
        let data = {
            'title' : 'Confirmation suppression',
            'content' : 'Voulez-vous vraiment supprimer cette image? '
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data){
                this.deletePhoto(uri);
            }
        });
    }

    initializeControleName() {
        let controlNameConfig: object = {
            'recherche': 'recherche',
            'statut': 'statut',
            'firstname': 'firstname'

        }
        this.controlName = controlNameConfig;
    }

    updateProfil(name) {
        this.currentField = name;
        this.oldUtilisateur.descriptionChanged = false;
        switch (name) {
            case 'statut': this.oldUtilisateur.id_statut = this.utilisateur.id_statut;  this.utilisateur.labelStatut = ''; break;
            case 'orientation': this.oldUtilisateur.id_orientation = this.utilisateur.id_orientation;
                this.utilisateur.labelOrientation = '';
                break;
            case 'situation': this.utilisateur.labelSituation = ''; 
                this.oldUtilisateur.id_situation = this.utilisateur.id_situation; break;
            case 'apparence':  this.oldUtilisateur.id_apparence = this.utilisateur.id_apparence;
            this.utilisateur.labelApparence = ''; break;
            case 'taille': this.oldUtilisateur.taille = this.utilisateur.taille; break;
            case 'poids': this.oldUtilisateur.poids = this.utilisateur.poids; break;
            case 'couleurCheveux': this.oldUtilisateur.id_couleurCheveux = this.utilisateur.id_couleurCheveux ;
            this.utilisateur.labelCouleurCheveux = ''; break;
            case 'couleurYeux': this.oldUtilisateur.id_couleurYeux = this.utilisateur.id_couleurYeux;
            this.utilisateur.labelCouleurYeux = ''; break;
            case 'tailleCheveux': this.oldUtilisateur.id_tailleCheveux = this.utilisateur.id_tailleCheveux;
            this.utilisateur.labelTailleCheveux = ''; break;
            case 'look': this.oldUtilisateur.id_look = this.utilisateur.id_look ; this.utilisateur.labelLook = ''; break;
            case 'signepart': this.oldUtilisateur.signeParticulier = this.utilisateur.signeParticulier; break;
            case 'origine':  this.oldUtilisateur.id_origine = this.utilisateur.id_origine; this.utilisateur.labelOrigine = ''; break;
            case 'tendances':  this.oldUtilisateur.id_tendance = this.utilisateur.id_tendance; this.utilisateur.labelTendance = ''; break;
            case 'experience':  this.oldUtilisateur.experience = this.utilisateur.experience; this.utilisateur.labelExperience = ''; break;
            case 'pratiques':  this.oldUtilisateur.id_pratique = this.utilisateur.id_pratique; this.utilisateur.labelPratiques = []; break;
            case 'mobilite':  this.oldUtilisateur.mobilite = this.utilisateur.mobilite; this.utilisateur.labelMobilite = ''; break;
            case 'disponibilite': this.oldUtilisateur.disponibilite = this.utilisateur.disponibilite;
            this.utilisateur.labelDisponibilite = ''; break;
            case 'propo':  this.oldUtilisateur.id_recherche = this.utilisateur.id_recherche;                
                this.oldUtilisateur.description = this.utilisateur.libelleDescription;
                this.oldUtilisateur.descriptionChanged = true;
                break;
        }
        this.oUser.utilisateur = this.oldUtilisateur;        
        console.log('update', this.oUser.utilisateur);
        this.homeApplicatifServiceACI.updateProfil(this.oUser).subscribe(oUser => {                      
            switch (name) {
                case 'statut': this.selectStatut = false;  this.disabledStatut = false; this.editStatut = false;
                this.opacityStatut =  1.0; break;
                case 'orientation':  this.disabledOrientation = false; this.selectOrientation = false;
                this.editOrientation = false; this.opacityOrientation =  1.0;
                this.updateOrientation(this.oldUtilisateur.id_orientation); break;
                case 'situation': this.disabledSituation = false; this.selectSituation = false;
                this.editSituation = false; this.opacitySituation =  1.0; this.updateSituation(this.oldUtilisateur.id_situation); break;
                case 'apparence': this.selectApparence = false; this.disabledApparence = false;
                this.editApparence = false; this.opacityApparence =  1.0; break;
                case 'taille': this.disabledTaille = false; this.editTaille = false;  this.blurTaille = false;
                this.opacityTaille =  1.0; break;
                case 'poids': this.disabledPoid = false; this.editPoid = false; 
                this.blurPoid = false; this.opacityPoid =  1.0; break;
                case 'couleurCheveux': this.selectCouleurCheveux = false; this.disabledCouleurCheveux = false;
                this.editCouleurCheveux = false; this.opacityCouleurCheveux =  1.0; break;
                case 'couleurYeux': this.selectCouleurYeux = false; this.disabledYeux = false;
                this.editYeux = false; this.opacityYeux =  1.0; break;
                case 'tailleCheveux': this.selectTailleCheveux = false; this.disabledTailleCheveux = false;
                this.editTailleCheveux = false; this.opacityTailleCheveux =  1.0; break;
                case 'look': this.selectLook = false; this.disabledLook = false; this.editLook = false;
                this.opacityLook =  1.0; break;
                case 'signepart': this.selectSigne = false;  this.disabledSigne = false; this.editSigne = false; 
                this.opacitySigne =  1.0; this.updateSigne(this.oldUtilisateur.signeParticulier); break;
                case 'origine': this.disabledOrigine = false; this.selectOrigine = false; this.editOrigine = false;
                this.opacityOrigine =  1.0; this.updateOrigine(this.oldUtilisateur.id_origine); break;
                case 'tendances': this.selectTendance = false;  this.disabledTendances = false; this.editTendance = false;
                this.opacityTendances =  1.0; this.updateTendance(this.oldUtilisateur.id_tendance); break;
                case 'experience':  this.disabledExperience = false; this.editExperience = false; 
                this.selectExperience = false; this.opacityExperience =  1.0; break;
                case 'pratiques': this.selectPratique = false; this.disabledPratiques = false; this.editPratique = false;
                this.opacityPratiques =  1.0; break;
                case 'mobilite': this.selectMobilite = false; this.disabledMobilite = false; this.editMobilite = false;
                this.opacityMobilite =  1.0; break;
                case 'disponibilite': this.selectDisponibilite = false; this.disabledDisponibilite = false;
                this.editDisponibilite = false; this.opacityDisponibilite =  1.0; break;
                case 'propo': this.blurAboutMe = false;  this.disabledPropo = false; this.opacityPropo =  1.0;
                this.editAboutMe = false; break;
            }          
            this.modifProfilInit();
            this.currentField = '';
            this.field = '';
            this.enableField = '';
        }, err => {
            this.currentField = '';
            this.field = '';
            this.enableField = '';
            console.log(err);
        });

    }
    public updateOrientation(orientation) {
        var self = this;
        this.userDetail.value[2].value.map(data => {
            data;
            if (data.id == orientation) {
            self.orientation = '' + data.label;
            }
        })
    }
    public updateSituation(situation){
        var self = this;
        this.userDetail.value[2].value.map(data => {
            data;
            if (data.id == situation) {
            self.situation = '' + data.label;
            }
        })
    }
    public updateOrigine(origine){
        var self = this;
         this.userDetail.value[15].value.map(data => {
            data;
            if (data.id == origine) {
            self.origine = '' + data.label;
            }
        })
    }
    public updateTendance(tendance) {
        var self = this;
        this.userDetail.value[2].value.map(data => {
            if (data.id == tendance) {
                this.tendance = data.label.toLowerCase();
            }
        })
    }

    public updateSigne(signe){
        var self = this;
        this.userDetail.value[16].value.map(data => {
            data;
            if (data.id == signe) {
            self.signepart = "" + data.label;
            }
        })
    }

    openUpdatePseudoMail(name): void {
        let email = '';
        switch (name) {
            case 'pseudo': this.imgPseudo = '../../../assets/img/loader.gif'; this.oldUtilisateur.pseudo = this.utilisateur.pseudo; break;
            case 'email': this.imgEmail = '../../../assets/img/loader.gif'; email = this.oldUtilisateur.email; this.oldUtilisateur.email = this.utilisateur.email; break;
        }


        this.homeApplicatifServiceACI.updatePseudoEmail(this.utilisateur.pseudo, this.utilisateur.email).subscribe(oUser => {
            oUser;
            switch (name) {
                case 'pseudo': this.imgPseudo = '../../../assets/img/edit.png'; this.disabledPseudo = false; this.opacityPseudo =  1.0; break;
                case 'email': this.imgEmail = '../../../assets/img/edit.png'; this.disabledEmail = false; this.opacityEmail =  1.0; break;
            }
            this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
                this.sharedDataService.setUserConnected(userConnecte);
            })
        });

        if (name == 'email') {
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('rfIuid');
            sessionStorage.removeItem('allUnreadMessageCount');
            this.router.navigate(['/login']);
        }
    }

    public openConfirmModal(name) {
        if (name === 'pseudo'){
            this.openUpdatePseudoMail(name);
        }else{
            let email = '';
            this.bsModalRef = this.modalService.show(ModalConfirmComponent);
            var modalComponent = this.bsModalRef.content as ModalConfirmComponent;
            let data = {
                'title' : 'Confirmation modification',
                'content' : 'Voulez-vous vraiment changer votre email? Vous serez deconnecté et votre compte sera désactivé jusqu\'à ce que vousconfirmiez votre nouvel email.'
            }

            modalComponent.model = data;
            modalComponent.afterModelLoad();
            modalComponent.out.subscribe((result) => {
                if (result.data){
                    this.openUpdatePseudoMail(name);
                }else{
                    switch (name) {
                        case 'email': this.imgEmail = '../../../assets/img/edit.png'; this.disabledEmail = false; this.opacityEmail =  1.0; this.utilisateur.email = this.oldUtilisateur.email; break;
                    }
                }
            });
        }
    }


    changeStatut(name) {
        this.field = name;
        switch (name) {
            case 'statut': this.disabledStatut = true; this.selectStatut = true; this.opacityStatut = 1; break;
            case 'orientation': this.disabledOrientation = true; this.selectOrientation = true;  this.opacityOrientation = 1; break;
            case 'situation': this.disabledSituation = true; this.selectSituation = true; this.opacitySituation = 1; break;
            case 'apparence': this.disabledApparence = true; this.selectApparence = true; this.opacityApparence = 1; break;
            case 'taille': this.disabledTaille = true; this.opacityTaille =  1.0; break;
            case 'poids': this.disabledPoid = true; this.opacityPoid =  1.0; break;
            case 'couleurCheveux': this.disabledCouleurCheveux = true; this.selectCouleurCheveux = true; this.opacityCouleurCheveux =  1.0; break;
            case 'couleurYeux': this.disabledYeux = true; this.selectCouleurYeux = true;  this.opacityYeux =  1.0; break;
            case 'tailleCheveux': this.disabledTailleCheveux = true; this.selectTailleCheveux = true; this.opacityTailleCheveux =  1.0; break;
            case 'look': this.disabledLook = true; this.selectLook = true;  this.opacityLook =  1.0; break;
            case 'signepart': this.disabledSigne = true; this.selectSigne = true; this.opacitySigne =  1.0; break;
            case 'origine': this.disabledOrigine = true; this.selectOrigine = true; this.opacityOrigine = 1; break;
            case 'tendances': this.disabledTendances = true; this.selectTendance = true; this.opacityTendances = 1; break;
            case 'experience': this.disabledExperience = true; this.selectExperience = true; this.opacityExperience = 1; break;
            case 'pratiques': this.disabledPratiques = true; this.selectPratique = true; this.opacityPratiques = 1; break;
            case 'mobilite': this.disabledMobilite = true; this.selectMobilite = true; this.opacityMobilite = 1; break;
            case 'disponibilite': this.disabledDisponibilite = true; this.selectDisponibilite = true; this.opacityDisponibilite = 1; break;
            case 'propo': this.disabledPropo = true; this.opacityPropo = 1; break;
            case 'pseudo': this.disabledPseudo = true; this.opacityPseudo = 1; break;
            case 'email': this.disabledEmail = true; this.opacityEmail = 1; break;
        }
    }

    isProfilExcluded(profilValue: string) {
        console.log(profilValue);
        let isInvalidPseudo = false;
        this.errorProfilMessage = '';

        let hasExcludedMessage =  {
            excluded: false,
            message : []
        };

        if (profilValue !== '') {
            const profil = profilValue;
            const profilLower = profil.toLocaleLowerCase();
            const exludedFilter = this.profilsForbidden.filter(excluded =>
                profilLower.includes(excluded.value.trim().toLocaleLowerCase()));
            /* isInvalidPseudo = this.profilsForbidden.some(it => profilLower.indexOf(it.value.trim().toLocaleLowerCase()) !== -1); */
            hasExcludedMessage =  {
                excluded:  exludedFilter.length > 0,
                message : exludedFilter
            };
        }
        if (hasExcludedMessage.excluded) {
            const pluriel = hasExcludedMessage.message.length === 1 ? '' : 's';
            const errorMessage =  ` ${this.profilNotAutorized}
                Il contient le${pluriel} mot${pluriel} "${hasExcludedMessage.message.map(res => res.value).join('", "')}". `;
            this.errorProfilMessage = errorMessage;
        }

        return undefined;
    }
    base64textString: string;
    profilBase64: string;
    public oPhoto: any = {};
    public photoProfil: any = {};
    changerProfil(uri: any) {
        this.loading = true;
        this.photoProfil.uri = uri;
        this.homeApplicatifServiceACI.editerPhotoProfil(this.photoProfil).subscribe(
            () => {               
                if (this.publicPhoto) {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, true).subscribe(photos => {
                        this.photos = photos;
                    });
                }
                else {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, false).subscribe(photos => {
                        this.photos = photos;
                    });
                }
                //reload modif profil
                this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
                    this.loading = false;
                    this.userDetail = userConnecte;
                    this.sharedDataService.setUserConnected(userConnecte);
                })
            }
        );

    }

    fileEvent(evt: any) {
        this.loading = true;
        var files = evt.target.files;

        var file = files[0];

        if (files && file) {
            var reader = new FileReader();
            this.oPhoto.profile = '0';
            this.oPhoto.uid = this.uid;
            this.oPhoto.dateCreate = '2017-07-14';
            this.oPhoto.dateUpdate = '2017-07-14';
            this.oPhoto.name = file.name;
            this.oPhoto.type = file.type;
            if (this.publicPhoto)
                this.oPhoto.isPublic = true;
            else
                this.oPhoto.isPublic = false;


            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(file);
        }
    }

    _handleReaderLoaded(readerEvt) {
        this.base64textString = readerEvt.target.result.split(",");
        this.oPhoto.data = 'data:image/false;base64,' + this.base64textString;
        if (this.base64textString && this.verifyNbPhotos()) {
            this.homeApplicatifServiceACI.ajouterPhoto(this.oPhoto).subscribe(res => {
                this.loading = false;
                if (this.publicPhoto) {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, true).subscribe(photos => {
                        this.photos = photos;
                        this.photosPub = photos;
                        this.nbPhoto = photos.length;
                        this.nbPhotoPub = this.nbPhotoPub + 1;
                    });
                } else {
                    this.homeApplicatifServiceACI.listePhoto(this.uid, false).subscribe(photos => {
                        this.photos = photos;
                        this.photosPriv = photos;
                        this.nbPhoto = photos.length;
                        this.nbPhotoPriv = this.nbPhotoPriv + 1;
                    });
                }
                this.sharedDataService.listAlbums.next(this.photos);
                this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
                    this.sharedDataService.setUserConnected(userConnecte);
                });
            }, err => {
                this.loading = false;
                if (err === 'server error') {
                    this.errorCallback('La taille de l\'image dépasse la taille maximale autorisée par le serveur (1Mo)');
                }
            });
        }
    }

    verifyNbPhotos(){
        let cond = this.publicPhoto ? this.nbPhotoPub >= 20 : this.nbPhotoPriv >= 20
        if (cond) {
            this.errorCallback('Le nombre de photos est limité à 20 pour chaque album');
            this.loading = false;
            return false;
        }
        return true;
    }

    initialisationUtilisateur(oUser) {
        //Initialisation
        console.log("test", oUser);
        oUser.value[1].value.map(statut => {
            statut;
            if (statut.checked == true) {
                this.utilisateur.id_statut = statut.id;
                this.utilisateur.labelStatut = statut.label;
                this.oldUtilisateur.id_statut = statut.id;
            }
        });
        //Orientation
        oUser.value[2].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_orientation = data.id;
                this.utilisateur.labelOrientation = data.label;
                this.oldUtilisateur.id_orientation = data.id;
            }
        });
        //Situation
        oUser.value[3].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_situation = data.id;
                this.utilisateur.labelSituation = data.label;                
                this.oldUtilisateur.id_situation = data.id;
            }
        });
        //tendance
        oUser.value[4].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_tendance = data.id;
                this.utilisateur.labelTendance = data.label;
                this.oldUtilisateur.id_tendance = data.id;
            }
        });
        //pratique
        this.utilisateur.labelPratiques = [];
        oUser.value[5].value.map(data => {
            data;

            if (data.checked == true) {
                this.utilisateur.id_pratique.push(data.id);
                this.utilisateur.labelPratiques.push(data.label);
                this.oldUtilisateur.id_pratique.push(data.id)
            }

        });

        //Recherche
        oUser.value[6].value.map(data => {
            data;

            if (data.checked == true) {
                this.utilisateur.id_recherche = data.id;
                this.oldUtilisateur.id_recherche = data.id;
            }
        });
        //Apparence
        oUser.value[0].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_apparence = data.id;
                this.utilisateur.labelApparence = data.label;
                this.oldUtilisateur.id_apparence = data.id;
            }
        });
        //mobilité
        oUser.value[12].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.mobilite = data.id;
                this.utilisateur.labelMobilite = data.label;
                this.oldUtilisateur.mobilite = data.id;
            }
        });
        //disponibilité
        oUser.value[13].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.disponibilite = data.id;
                this.utilisateur.labelDisponibilite = data.label;
                this.oldUtilisateur.disponibilite = data.id;
            }
        });
        //experience
        oUser.value[14].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.experience = data.id;
                this.utilisateur.labelExperience = data.label;
                this.oldUtilisateur.experience = data.id;
            }
        });

        //Origine
        oUser.value[15].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_origine = data.id;
                this.utilisateur.labelOrigine = data.label;
                this.oldUtilisateur.id_origine = data.id;
            }
        });

        //couleur cheveux
        oUser.value[8].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_couleurCheveux = data.id;
                this.utilisateur.labelCouleurCheveux = data.label;
                this.oldUtilisateur.id_couleurCheveux = data.id;
            }
        });

        //couleur de yeux
        oUser.value[9].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_couleurYeux = data.id;
                this.utilisateur.labelCouleurYeux = data.label;
                this.oldUtilisateur.id_couleurYeux = data.id;
            }
        });

        //taille cheveux
        oUser.value[10].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_tailleCheveux = data.id;
                this.utilisateur.labelTailleCheveux = data.label;
                this.oldUtilisateur.id_tailleCheveux = data.id;
            }
        });

        //look
        oUser.value[11].value.map(data => {
            data;
            if (data.checked == true) {
                this.utilisateur.id_look = data.id;
                this.utilisateur.labelLook = data.label;
                this.oldUtilisateur.id_look = data.id;
            }
        });

         //signe
       oUser.value[16].value.map( data => {
            data;
            if (data.checked == true) {
                this.utilisateur.signeParticulier = data.signeParticulier
                this.utilisateur.labelSigne = data.label;
                this.oldUtilisateur.signeParticulier = data.signeParticulier;
            }
        });


        this.utilisateur.description = oUser.description;
        this.utilisateur.libelleDescription = oUser.libelleDescription;
        this.utilisateur.id_vsetes = 'couple';
        this.utilisateur.pseudo = oUser.pseudo;
        this.utilisateur.email = oUser.email;
        this.utilisateur.taille = oUser.taille;
        this.utilisateur.poids =  oUser.poids;

        this.oldUtilisateur.description = oUser.description;
        this.oldUtilisateur.id_vsetes = 'couple';
        this.oldUtilisateur.pseudo = oUser.pseudo;
        this.oldUtilisateur.email = oUser.email;
        this.oldUtilisateur.taille = oUser.taille;
        this.oldUtilisateur.poids =  oUser.poids;

    }

    emailToLowerCase(): void{
        this.utilisateur.email = this.utilisateur.email.toLowerCase();
    }

    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }


}
