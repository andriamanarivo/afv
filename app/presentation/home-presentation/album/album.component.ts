import { Component, OnInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Lightbox } from 'angular2-lightbox';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { AutorisationService } from '../../../commun/autorisation.service';
@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
    @Input() accept = '*';
    @Input() allowUpdatePhotoProfil = false;
    @Input() isDescription = false;
    @Input() isMyProfil = false;
    @Input() isPublic = false;
    @Input() loading = false;
    @Input() photos = [];
    @Input() widthImgWraper: string;
    @Output() onChangeProfil = new EventEmitter();
    @Output() onFileEvent = new EventEmitter();
    @Output() onOpenModalImageDelete = new EventEmitter();
    albums = [];
    baseUrl = '';
    public autorisation;

    constructor(private appConfig: AppConfig, private _lightbox: Lightbox,
        private sharedDataService: SharedDataService, private autorisationService: AutorisationService) {
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
        this.sharedDataService.listAlbums.subscribe((list) => {
            this.photos = list;
            this.setAlbums();
        });
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes && changes['photos'] && changes['photos'].currentValue) {
            this.setAlbums();
        }
    }

    getWidth() {
        return this.widthImgWraper ? { 'width': this.widthImgWraper } : '';
    }

    fileEvent(event) {
        this.onFileEvent.next(event);
    }
    
    setAlbums() {       
        if(this.photos['statut'] && this.photos['statut'] === 500){
            this.photos = [];
        } else {
            this.albums = [];
            if (this.isDescription) {
                this.photos = this.getSixLastImage();
            }
            for (const i in this.photos) {
                if (this.photos.hasOwnProperty(i)) {
                    if (this.photos[i].uri) {
                        const thumb = this.baseUrl +
                            this.photos[i].uri.replace('file_uploaded/', 'file_uploaded/square_320_');
                        const src = this.baseUrl + this.photos[i].uri;
                        const caption = this.photos[i].uri;
                        const alb = {
                            src: src,
                            caption: '',
                            thumb: thumb
                        };
                        this.albums.push(alb);
                    }
                }
            }
        }        
    }

    openModalImageDelete(url: string): void {
        this.onOpenModalImageDelete.next(url);
    }

    changerProfil(url: string): void {
        this.onChangeProfil.next(url);
    }

    open(index: number): void {
        this._lightbox.open(this.albums, index);
    }

    ngOnInit() {
        this.autorisation = this.autorisationService.getAutorisation();
        if (!this.autorisation['PROFIL_8']) {
            // console.log('******* Authorisation : PROFIL_8', this.autorisation['PROFIL_8']);
        }
        if (!this.autorisation['PROFIL_9']) {
            // console.log('******* Authorisation : PROFIL_9', this.autorisation['PROFIL_9']);
        }
    }

    getSixLastImage() {
        const albums = [];
        for (let i = 1; i < 7; i++) {
            if (this.photos[this.photos.length - i]) {
                albums.push(this.photos[this.photos.length - i]);
            }
        }
        return albums;
    }

}
