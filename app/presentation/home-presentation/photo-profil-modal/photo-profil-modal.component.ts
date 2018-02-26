import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { SharedService } from '../../../commun/shared-service';
import {Message as MessagePrimeNg} from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
    selector: 'app-photo-profil-modal',
    templateUrl: './photo-profil-modal.component.html',
    styleUrls: ['./photo-profil-modal.component.css'],
    providers: [MessageService]
})

export class PhotoProfilModalComponent implements OnInit {
    loading: boolean;
    oPhoto: any = {};
    uid: string;
    base64textString: string;
    msgs: MessagePrimeNg[] = [];
    errorMessage = "";
    constructor(private messageService: MessageService, private shardService: SharedService, public bsModalRef: BsModalRef, private sharedDataService: SharedDataService, private changeDetector: ChangeDetectorRef, public homeApplicatifServiceACI: HomeApplicatifServiceACI) { }

    ngOnInit() {
        this.sharedDataService.getUserConnected().subscribe(userDetail => {
            this.uid = userDetail.uid;
        });
        this.shardService.closeAllModal.subscribe(data => {
            if (data) {
                this.bsModalRef.hide();
            }
        });
    }

    fileEvent(evt: any) {
        this.loading = true;
        var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
            this.oPhoto.profile = "1";
            this.oPhoto.uid = this.uid;
            this.oPhoto.dateCreate = "2017-07-14";
            this.oPhoto.dateUpdate = "2017-07-14";
            this.oPhoto.name = file.name;
            this.oPhoto.type = file.type;
            this.oPhoto.isPublic = true;
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(file);
        }
    }

    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "", detail: err });
    }

    _handleReaderLoaded(readerEvt) {    
        this.base64textString = readerEvt.target.result.split(",");              
        this.oPhoto.data = 'data:image/false;base64,' + this.base64textString;                
        if (this.base64textString) {
            this.setPhotoProfil();
        }
    }

    private setPhotoProfil() {
        this.errorMessage = "";
        this.homeApplicatifServiceACI.ajouterPhoto(this.oPhoto).subscribe(res => {
            this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
                this.loading = false;
                this.sharedDataService.setUserConnected(userConnecte);
                this.bsModalRef.hide();
            });
        }, err=>{           
            this.loading = false;
            if(err === 'server error'){
                this.errorMessage = "La taille de l'image dépasse la taille maximale autorisée par le serveur (1Mo)";
            }
        });
    }
}
