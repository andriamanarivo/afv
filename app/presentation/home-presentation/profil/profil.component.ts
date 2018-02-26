import { Component, OnInit
    , Output, EventEmitter,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { SharedService } from '../../../commun/shared-service';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { environment } from '../../../../environments/environment';

import { CryptionAesService } from '../../../commun/cryption-aes.service';
import {Message as MessagePrimeNg} from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { AutorisationService } from '../../../commun/autorisation.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalReportabusComponent } from '../../../presentation/home-presentation/tchat/modal/modal-reportabus.component';
import { ConfirmMessageComponent } from '../../../presentation/home-presentation/tchat/confirm.message.component';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { PagerService } from 'app/service/pager.service';
import { HomeApplicatifService } from '../../../service/applicatif/home';

@Component({
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.css'],
    providers: [MessageService]
})
export class ProfilComponent implements OnInit {

    baseUrl = '';
    userStatus = false;

    showAction = false;

    public userDetail?: any;
    msgs: MessagePrimeNg[] = [];
    public publicPhoto: boolean = false;
    public privePhoto: boolean = false;
    public albumChoice: boolean = true;
    public nbPhoto: any = 0;
    public nbAllPhoto: any = 0;
    public prevTabIndex = 0;
    uid: string;
    identifiant: string;
    loading: boolean = false;
    public photos: any;
    public tendance: any;
    public photosCouv: any = [];

    public photosPub = 0;
    public photosPriv = 0;
    public photosPubShow: any;
    public photosPrivShow: any;
    public nbPhotoPub: number = 0;
    public nbPhotoPriv: number = 0;
    public favoris: any;
    public nbFavoris: number;

    public favorisCount: number;
    public nbVisiteur: number;

    public activeTab: number = 1;
    public nbPhotoPrivPub : number = 0;
    public allowTchat: boolean= true;
    public load: boolean= false;
    public userSuspended: boolean= false;
    public autorisation;
    public isBlackListed = false;
    public tchatErrorMesage = '';
    errors = [];
    public allowPublic = null;
    public allowPrive = false;
    public loadFavoris = false;
    totalItems: number = 0;
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    emptyMessage = '';
    loadData = false;
    userNotfound = false;

    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private route: ActivatedRoute,
        private cryptionAesService: CryptionAesService,
        private appConfig: AppConfig,
        public sharedService: SharedService,
        public sharedDataService: SharedDataService,
        private photoPdp: PhotoPdp,
        private messageService: MessageService,
        private autorisationService: AutorisationService,
        private bsModalRef: BsModalRef,
        public dialog: MdDialog,
        private modalService: BsModalService,
        private router: Router,
        private pagerService: PagerService,
        private homeApplicatifService: HomeApplicatifService
    ) {
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
        this.sharedDataService.onSelectContact.subscribe(selectedContact => {
            if (selectedContact && selectedContact.uid) {
                this.uid = selectedContact.uid;
                this.getUserDetail(selectedContact.uid);
            }
        });


        this.sharedService.favorisData.subscribe(data => {
            if (data) {
                if (this.userDetail && this.userDetail.id === data.user.id) {
                    this.userDetail.isFavoris = data.deleteFavoris? false : true;
                }
            }
        });
     }

    ngOnInit() {
        this.sharedService.favoris$.subscribe(p => {
            this.favorisCount = p;
        });
        this.autorisation = this.autorisationService.getAutorisation();
        this.route.params.subscribe(params => {
            switch (params['to']) {
                case 'photos':
                    this.activeTab =  2;
                    break;
                case 'messages':
                    this.activeTab =  5;
                    break;
                default:
                    this.activeTab =  1;
            }
        });

        this.route.params.subscribe(params => {
            this.uid = params['id'];
            this.loadData = true;
            this.getUserDetail(this.uid);
        });

        this.sharedService.listeFavoris$.subscribe(p => {
            let favorisModified = [];
            if (p) {
                this.sharedDataService.userConnected.subscribe(user => {
                    if (user) {
                        this.homeApplicatifServiceACI.listeFavoris(user.uid, 0, 10).subscribe(connectedFavoris => {
                            favorisModified = this.mapPhotoProfil(p, connectedFavoris);
                            this.favoris = favorisModified;
                            this.nbFavoris = (this.favoris).length;
                        });
                    } else {
                        favorisModified = this.mapPhotoProfil(p, null);
                        this.favoris = favorisModified;
                        this.nbFavoris = (this.favoris).length;
                    }
                });



                // will be used when WS is available
                /* favorisModified = p.map(favori => {
                    if (!favori.photo) {
                        if (favori.idVsEtes !== null) {
                            const profilePhoto = this.photoPdp.getPhotoPdp(favori.idVsEtes);
                            if (profilePhoto) {
                                favori.defaultpdp = profilePhoto.pdp;
                            } else {
                                favori.defaultpdp = 'assets/img/profil-default.png';
                            }
                        } else {
                            favori.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }
                    return favori;
                }); */
            }
        });
    }
    onContactSelected (selectedContact) {
        console.log(selectedContact);
        this.userStatus = selectedContact.status;
    }
    nonAutorise() {
        return this.allowPublic !== null && !this.allowPublic  ? 'Vous n\'avez pas de privileges pour regarder' : '';
    }

    onClick(event): void {
        const target = event.target || event.srcElement;
        if (target.id !== 'linkPopup' && target.id !== 'blacklisterLabel' && target.id !== 'reportLabel'){
            this.showAction = false;
        }
    }
    publicPhotoIsEmpty(){
        return this.nbPhotoPub !== null && this.nbPhotoPub === 0 ? 'Cette personne n\'a pas de photos publics' : '';
    }

    // recupère les données de l'utilisateur séléctioné
    getUserDetail(uid: string): void {
        this.homeApplicatifServiceACI.getUserDetail(uid).subscribe(userDetail => {
            console.log('userDetail: ', userDetail);
            this.userNotfound = false;
            this.loadData = false;
            if (userDetail && userDetail.status === 400) {
                this.userSuspended = true;
            } else if (userDetail && userDetail.status === 404) {
                this.userNotfound = true;
            } else {
                this.isBlackListed = userDetail.isBlacklisted;
                if (!userDetail.photo) {
                    if (!userDetail.idVsetes) {
                        userDetail.defaultpdp = 'assets/img/profil-default.png';
                    } else {
                        const profilePhoto = this.photoPdp.getPhotoPdp(userDetail.idVsetes);
                        if (profilePhoto) {
                            userDetail.defaultpdp = profilePhoto.pdp;
                        } else {
                            userDetail.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }
                }
                this.userDetail = userDetail;
                // TODO
                /* this.userDetail.favoris = false; */
                if (this.userDetail.pseudo) {
                    // on ne stock pas undefined
                    const ctJid = this.userDetail.id + '@' + environment.openfireServer;
                    const encryptedctJid = this.cryptionAesService.cryptMessage(ctJid);
                    sessionStorage.setItem('ctJid', encryptedctJid.toString());
                }
                this.tendance = this.userDetail.tendance ? this.userDetail.tendance.toLocaleLowerCase() : '';
                this.nbVisiteurAndFavorie();
            }
        }, err => {
            this.loadData = false;
            this.errorCallBack(err);
        });
        if (!this.userSuspended) {
            this.getPhotoPublic(uid);
            this.getPhotoPrive(uid);
        }
        this.setPage(1, uid);
    }

    setPage(page: number, uid: string) {
        this.load = true;
        this.allItems = [];
        const offset = 12 * (page - 1);
        const sortData = { order: 'firstName', desc: 0 };
        this.homeApplicatifServiceACI.listeFavoris(uid, offset, 12, sortData).subscribe(favoris => {
            this.load = false;
            let userModified = [];
            if (favoris.value) {
                userModified = favoris.value.map(user => {
                    if (!user.photo) {
                        if (user.idVsEtes !== null) {
                            const profilePhoto = this.photoPdp.getPhotoPdp(user.idVsEtes);
                            if (profilePhoto) {
                                user.defaultpdp = profilePhoto.pdp;
                            } else {
                                user.defaultpdp = 'assets/img/profil-default.png';
                            }
                        } else {
                            user.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }
                    return user;
                });
            }
            this.totalItems = favoris.nbResults;
            this.allItems = favoris.value;
            this.favoris = favoris.value;
            if (favoris.value) {
                if (page < 1 || page > this.pager.totalPages) {
                    return;
                }
                this.pager = this.pagerService.getPager(this.totalItems, page, 12);
                this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
            }
        }, err => {
            this.load = false;
        });
    }

    getEmptyFavoris(): string {
        return this.totalItems === 0 || !this.totalItems ? 'Cette personne n\'a pas de favoris pour l\'instant' : '';
    }

    mapPhotoProfil(favoris, connectedFavoris) {
        return favoris.map(favori => {
            if (connectedFavoris !== null && connectedFavoris.value && connectedFavoris.nbResults > 0) {
                const favoriFound = connectedFavoris.value.find(x => x.id === favori.id);
                if (favoriFound) {
                    favori.favoris = true;
                }
            }
            if (!favori.photo) {
                if (favori.idVsEtes !== null) {
                    const profilePhoto = this.photoPdp.getPhotoPdp(favori.idVsEtes);
                    if (profilePhoto) {
                        favori.defaultpdp = profilePhoto.pdp;
                    } else {
                        favori.defaultpdp = 'assets/img/profil-default.png';
                    }
                } else {
                    favori.defaultpdp = 'assets/img/profil-default.png';
                }
            }
            return favori;
        });
    }
    cancelClick(event) {
        event.stopPropagation();
        this.popupAction();
    }
    selectTab(event) {
        console.log(event.index);
        if (event.index === 0) {
            if (this.prevTabIndex) {
                event.index = this.prevTabIndex;
                this.activeTab = this.prevTabIndex;
            }
            this.popupAction();
        } if (event.index !== 5
            // && event.index !== 0
           ) {
           this.prevTabIndex = event.index;
       } else if (this.userDetail) {
            /* if (event.index === 0) {
                this.isBlackListed = false;
                this.prevTabIndex = event.index;
            } */
            // Verifier si parmis les blacklist pour desactiver tchat
            this.homeApplicatifServiceACI.checkinBlackList(this.userDetail.pseudo)
                .subscribe(res => {
                    console.log(res);
                    if (res.isBlackList === true || res.isUserAddBlackList) {
                        this.isBlackListed = true;
                    }
                    if (res.isBlackList === true || res.isUserAddBlackList) {
                        this.activeTab = 0;
                       this.allowTchat = false;
                       this.tchatErrorMesage = res.isUserAddBlackList ?
                       'Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire.' :
                       `Vous ne pouvez plus tchater avec cet utilisateur. 
                       Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.`;
                    } else {
                        this.allowTchat = true;
                    }
                }, err => {
                    this.errorCallBack(err);
                });
        }
    }

    showWarning(err) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    private errorCallBack(err): void{
        // TODO SHOW ERROR IN POPUP
        console.log(err);
    }
    public showPublic() {
        if (this.autorisation['PROFIL_6']){
            this.allowPublic = true;
            this.publicPhoto = true;
            this.privePhoto = false;
            this.albumChoice = false;
            this.photos = this.photosPub;
            this.getPhotoPublic(this.uid);
            // this.nbPhoto = this.nbPhotoPub
        }
    }

    public showPrive() {
        if (this.autorisation['PROFIL_10']){
            this.allowPrive = true;
            this.publicPhoto = false;
            this.privePhoto = true;
            this.albumChoice = false;
            this.photos = this.photosPriv
            this.getPhotoPrive(this.uid);
            // this.nbPhoto = this.nbPhotoPriv
        }
    }

    public album() {
        this.photos = [];
        this.nbPhoto = 0;
        this.publicPhoto = false;
        this.privePhoto = false;
        this.albumChoice = true;
    }


    setFavoris(fav) {
       for (const i in fav) {
        if (fav.hasOwnProperty(i)) {
            fav[i].favoris = true;
        }
       }
   }


   addFavoris(user) {
    console.log('user.id', user.id);
    this.loading = true;
    this.homeApplicatifServiceACI.addFavoris(user.id).subscribe((res) => {
        this.loading = false;
        if (res.status === 200) {
            this.favorisCount = (this.favorisCount + 1);
            this.sharedService.favoris = (this.favorisCount);
            user.isFavoris = true;
            this.userDetail.isFavoris = true;
            this.sharedService.favorisData.next({ deleteFavoris: false, user: user });
        } else {
            this.errorCallback(res.status);
        }
    }, err => {
        this.loading = false;
        this.errorCallback(err);
    });
   }
   deleteFavoris(user) {
    this.loading = true;
    this.homeApplicatifServiceACI.deleteFavoris(user.id).subscribe((res) => {
        this.loading = false;
        if (res.status === 200) {
            user.isFavoris = false;
            this.userDetail.isFavoris = false;
            this.favorisCount = (this.favorisCount - 1);
            this.sharedService.favoris = this.favorisCount;
            this.sharedService.favorisData.next({ deleteFavoris: true, user: user });
        } else {
            this.errorCallback(res.status);
        }
    }, err => {
        this.loading = false;
        this.errorCallback(err);
    });
    }

   getPhotoPublic(uid: string){
        if (!this.userSuspended) {
            this.homeApplicatifServiceACI.listePhoto(uid, 'PUBLIC').subscribe(photos => {
                if (photos[0])
                    this.photosPubShow = photos[0].uri;
                let data = [];
                data = data.concat(photos);
                this.nbAllPhoto = photos.length;
                this.photosPub = photos;
                this.nbPhotoPub = photos.length;
                if (this.autorisation['PROFIL_6']){
                    this.allowPublic = true;
                }
                // this.photosCouv = data.splice(0, 6);
            }, err => {
                this.errorCallBack(err);
            });
        }
   }

   getPhotoPrive(uid: string){
        if (!this.userSuspended) {
            this.homeApplicatifServiceACI.listePhoto(uid, 'PRIVATE').subscribe(photosPriv => {
                    if (photosPriv[0])
                        this.photosPrivShow = photosPriv[0].uri;
                    this.photosPriv = photosPriv;
                    this.nbPhotoPriv = photosPriv.length;
                    // this.photos=
                    // this.nbAllPhoto = this.nbAllPhoto + photosPriv.length;
                    // this.nbPhotoPrivPub = this.nbPhotoPub + this.nbPhotoPriv;
            }, err => {
                this.errorCallBack(err);
            });
        }
   }

   /* openConfirmDialog(): void {
        this.popupAction();
        const dialogRef = this.dialog.open(ConfirmMessageComponent, {
            width: '350px',
            data: this.currentContact
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    } */

   openConfirmDialog(): void {
        const pseudo = this.userDetail && this.userDetail.pseudo ? this.userDetail.pseudo : '';

        const contentModal = this.isBlackListed ?
        'Etes vous sûr de vouloir Retirer de la blacklist ' + pseudo + '?' :
        'Etes vous sûr de vouloir blacklister ' + pseudo + '?';

        this.bsModalRef = this.modalService.show(ModalConfirmComponent);
        const modalComponent = this.bsModalRef.content as ModalConfirmComponent;
        const data = {
            'title': 'Confirmation modification',
            'content': contentModal,
            'isBlackListModal' : true,
            'isBlackListed' : this.isBlackListed,

            'uid' : this.uid
        };
        // console.log(data);
        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                console.log(result.data);
                if (result.isBlackListed) {
                    this.removeToBlackList(pseudo, result.uid);
                } else {
                    this.addToBlackList(pseudo, result.uid);
                }
            }
        });
    }

    public popupAction() {
        this.showAction = !this.showAction;
    }

    

    openReportabusDialog(): void {
        const pseudo = this.userDetail && this.userDetail.pseudo ? this.userDetail.pseudo : '';
        const data = {
            pseudo: pseudo,
            motif: '',
            contenu: '',
            idStatut: 1
        };
        const dialogRef = this.dialog.open(ModalReportabusComponent, {
            width: '350px',
            data: data
        });
    }

    addToBlackList(pseudo: string, uid: string): void {
        this.errors = [];
        this.homeApplicatifServiceACI.addToBlackList(pseudo)
            .subscribe(res => {
                // console.log(res);
                if (res.result) {
                    this.isBlackListed = true;
                    this.router.navigate(['/home/profil/' + uid]);
                } else {
                    if (res.error.length !== 0) {
                        this.showErrors(res.error);
                    }
                }
            },
            err => {
                this.errorCallback('Une erreur venant du serveur est survenue');
            });
    }

    removeToBlackList(pseudo: string, uid: string): void {
        this.errors = [];
        this.homeApplicatifServiceACI.removeToBlackList(pseudo)
            .subscribe(res => {
                // console.log(res);
                if (res.result) {
                    this.isBlackListed = false;
                    this.router.navigate(['/home/profil/' + uid]);
                } else {
                    if (res.error.length !== 0) {
                        this.showErrors(res.error);
                    }
                }
            },
            err => {
                this.errorCallback('Une erreur venant du serveur est survenue');
            });
    }

    showErrors(erreurs) {
      Object.keys(erreurs).forEach(key => {
        switch (erreurs[key]) {
          case 'errors.user.alreadyInBlacklist':
              this.errorCallback('Vous avez déjà blacklisté cet utilisateur');
              break;
          default:
              break;
        }
      });
    }

    errorCallback(err): void {
        this.errors.push(err);
    }

    nbVisiteurAndFavorie(){
        this.homeApplicatifService.getNbVisiteurAndFavoris().subscribe(res => {
            this.sharedService.setNbVisiteur(res.visiteur);
            this.sharedService.visiteur = res.visiteur;
        }, err => {
            console.log(err);
        });
    }


}
