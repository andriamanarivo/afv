import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'app/contrainte/config/_app/app.config';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { HomeApplicatifService } from 'app/service/applicatif/home';
import { ConfirmDialogComponent } from 'app/presentation/administration/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { SharedService, CryptionAesService } from 'app/commun';

@Component({
    selector: 'app-moderation-photo',
    templateUrl: './moderation-photo.component.html',
    styleUrls: ['./moderation-photo.component.css']
})
export class ModerationPhotoComponent implements OnInit {

    @ViewChild('childModal') public childModal: ModalDirective;
    columns: Array<any> = [];
    config: any;
    criteria: any = {};
    currentPhoto: any = {};
    errorMessage: string;
    isLoading = false;
    isSearch: boolean;
    itemsPerPage: number = 20;
    length = 0;
    maxSize = 5;
    numPages = 1;
    page = 1;
    rows: Array<any> = [];
    sortValue = '0';
    tempConfig: any;
    showResultimg= false;
    defaultFilter= '';

    constructor(
        private appConfig: AppConfig,
        private adminService: AdministrationApplicatifServiceACI,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private homeService: HomeApplicatifService,
        private router: Router,
        private sharedService: SharedService,
        private cryptionAesService: CryptionAesService,
    ) { }

    ngOnInit() {
        if (this.defaultFilter === '') {
            this.defaultFilter = 'false';
        }
        this.setColumns();
        this.setConfig();
        this.onChangeTable(this.config);
    }
    // { title: 'Accepter/Rejeter', name: 'btnAccept', sort: false },
    setColumns(): void {
        this.columns = [
            { title: 'Pseudo', name: 'pseudo', sort: false },
            { title: 'Genre', name: 'vsetes', sort: false },
            { title: 'Photos', name: 'uri', sort: false },
            { title: 'Moderation', name: 'statutModeration', sort: false },
            { title: 'Public/privé', name: 'btnUpdate', sort: false },
            { title: 'Supprimer', name: 'btnDelete', sort: false },
            { title: 'Date de création', name: 'dateCreate', sort: false },
            { title: 'Editer photo', name: 'editPhoto', sort: false }
        ];
    }

    showResult(): void{
        this.showResultimg = true;
    }

    setConfig(): void {
        this.itemsPerPage = this.appConfig.getConfig('adminItemsPerPage');
        this.criteria = {
            isTri: true,
            desc: true,
            first: 1,
            max: this.itemsPerPage,
            filter: { statut: '', email: '', pseudo: '' }
        };
        this.config = {
            paging: true,
            sorting: { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered']
        };
    }

    sortByDate(): void {
        this.criteria.isTri = true;
        this.criteria.desc = this.sortValue === '0' ? true : false;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

    onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): void {
        // console.log("config : ", this.config);
        const d = { config: config, page: page };
        let res;
        if (this.tempConfig) {
            res = this.isSameConfig(this.tempConfig, d);
        }
        if (!res || this.isSearch) {
            this.criteria.first = (page.page - 1) * 20;
            this.isLoading = true;
            // console.log("criteria : ", this.criteria);
            this.rows = [];
            this.adminService.getPhotos(this.criteria).subscribe(res => {
                this.tempConfig = {
                    config: JSON.parse(JSON.stringify(config)),
                    page: JSON.parse(JSON.stringify(page))
                };
                this.successCallback(res);
            }, err => {
                this.errorCallback(err);
            });
        }
    }

    isSameConfig(lastConfig, newConfig) {
        return lastConfig.config.filtering.filterString === newConfig.config.filtering.filterString
            && lastConfig.config.filtering.paging === newConfig.config.filtering.paging &&
            lastConfig.page.page === newConfig.page.page;
    }

    updateStatutModeration(): void {
        // console.log(this.currentPhoto);
        // this.isLoading = true;
        this.adminService.changeStatutModerationPhoto(this.currentPhoto.id)
            .subscribe(res => {
                // console.log(res);
                // console.log(this.tempConfig);
                this.isLoading = false;
                if (!res.response.error) {
                    this.childModal.hide();
                    this.isSearch = true;
                    this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
                }
            }, err => {
                // console.log(err);
                this.isLoading = false;
                this.errorMessage = 'Une erreur est survenue';
            });
    }

    cancel(): void {
        this.childModal.hide();
    }

    showAllPhotos(): void {
        this.isSearch = true;
        this.setColumns();
        this.setConfig();
        this.onChangeTable(this.config);
    }

    searchPhotos(statut, pseudo: string, email: string): void {
        // console.log(statut);
        this.defaultFilter = statut;
        statut= statut.replace('aucun', '');
        this.criteria.filter = { statut: statut ? JSON.parse(statut) : '', email: email, pseudo: pseudo };
        this.criteria.isTri = false;
        this.criteria.desc = false;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

    onCellClick(event): void {
        // console.log(event);
        this.errorMessage = '';
        switch (event.column) {
            case 'statutModeration': this.showUpdateModerationModal(event); break;
            case 'btnUpdate': this.changeScopePhoto(event); break;
            case 'btnAccept': this.currentPhoto.id = event.row.id; this.updateStatutModeration(); break;
            case 'btnDelete': this.confirmDeletePhoto(event.row.url, event.row.uid); break;
            case 'editPhoto': this.editImg(event.row.url); break;
            default: this.editImg(event.row.url); break;
        }
    }

    editImg(url:string): void{
        // console.log(url.replace('square_320_',''));
        const encryptedUrl = this.cryptionAesService.cryptMessage(url);
        sessionStorage.setItem('im', encryptedUrl.toString());
        this.router.navigate(['/administration/resize-photo']);
    }

    showUpdateModerationModal(event: any): void {
        this.currentPhoto = event.row;
        // console.log(this.currentPhoto);
        this.currentPhoto.moderation = +this.currentPhoto.moderation;
        this.childModal.show();
        this.childModal.onHide.subscribe(res => {
            this.currentPhoto = {};
        });
    }

    changeScopePhoto(event: any): void {
        this.adminService.changeScopePhoto(event.row.id)
            .subscribe(res => {
                // console.log(res);
                this.isLoading = false;
                if (!res.error) {
                    this.isSearch = true;
                    this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
                }
            }, err => {
                // console.log(err);
                this.isLoading = false;
                this.errorCallback(err);
            });
    }

    confirmDeletePhoto(url, uid): void {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            title: 'Confirmation suppression',
            content: 'Voulez-vous vraiment supprimer cette photo ?'
        };
        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                this.deletePhoto(url, uid);
            }
        });
    }

    deletePhoto(uri, uid?) {
        // console.log(uri);
        // console.log(uid);
        this.homeService.deletePhoto({ uri: uri, uid: uid }).subscribe(res => {
            this.isLoading = false;
            // console.log(res);
            if (!res['errorExist']) {
                this.isSearch = true;
                this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
            } else {
                this.errorMessage = 'Une erreur est survenue lors de la suppression du photo';
            }
        }, err => {
            // console.log(err);
            this.isLoading = false;
            this.errorMessage = 'Une erreur est survenue lors de la suppression du photo';
        });
    }

    successCallback(res: any) {
        // console.log("liste photos : ", res);
        this.isSearch = false;
        this.criteria.isTri = false;
        this.isLoading = false;
        if (res['photos'] && res['photos'].length !== 0) {
            let photos = res['photos'];
            photos.forEach(photo => {
                photo['btnDelete'] = '<button type="button"  data-id=' + photo.id + '  class="btn btn-success">Supprimer</button>';
                photo['editPhoto'] = '<button type="button"  data-id=' + photo.id + '  class="btn btn-success">Editer photo</button>';
                photo['moderation'] = photo.statutModeration;
                photo['statutModeration'] = '<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=' + photo.id + '><i class=\"fa fa-pencil-square-o\" ></i> </span>' + (photo.moderation ? 'Modéré' : 'A modérer') + '</a>';
                photo['url'] = photo['url'];
                photo['path'] = photo['uri'];
                photo['uri'] = photo['uri'] + '?v=' + Math.random();
                photo['uri'] = '<span class="profil-gm"><img src=' + photo['uri'] + '></span>';
                if (photo.isPublic) {
                    photo['btnUpdate'] = '<button type="button"  data-id=' + photo.id + '  class="btn btn-success">Passer en privé</button>';
                } else {
                    photo['btnUpdate'] = 'Photo privé';
                }
                if (photo.moderation) {
                    photo['btnAccept'] = '<button type="button"  data-id=' + photo.id + '  class="btn btn-success">Rejeter</button>';
                } else {
                    photo['btnAccept'] = '<button type="button"  data-id=' + photo.id + '  class="btn btn-success">Accepter</button>';
                }
            });
            this.rows = photos;
            this.length = res['nbResults'];
        } else {
            // console.log("LISTE VIDE");
            this.length = 0;
            this.rows = [];
        }
    }

    errorCallback(err: any): void {
        this.isSearch = false;
        this.criteria.isTri = false;
        this.isLoading = false;
        // console.log(err);
        this.errorMessage = 'Une erreur est survenue';
    }

    changeItemsPerPage(nb: number): void {
        this.criteria.max = nb;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

    getEmptyMessage() {
        return this.rows && this.rows.length > 0 ? '' : 'Aucun résultat pour votre recherche';
    }

}
