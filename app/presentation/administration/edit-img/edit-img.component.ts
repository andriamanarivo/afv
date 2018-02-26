import { Component, OnInit } from '@angular/core';
import { SharedService, CryptionAesService } from 'app/commun';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from 'app/presentation/administration/confirm-dialog/confirm-dialog.component';
import { AppConfig } from 'app/contrainte/config/_app/app.config';


@Component({
    selector: 'app-edit-img',
    templateUrl: './edit-img.component.html',
    styleUrls: ['./edit-img.component.css']
})
export class EditImgComponent implements OnInit {
    baseUrl: any;

    form: FormGroup;
    height = 0;
    imgstyle = {};
    resultUrl: any;
    urlimg = '';
    width = 0;

    constructor(
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private cryptionAesService: CryptionAesService,
        private router: Router,
        private sharedService: SharedService,
        private fb: FormBuilder,
        private appConfig: AppConfig,
        private administrationApplicatifService: AdministrationApplicatifServiceACI) {
        this.form = this.fb.group({
            'width': [''],
            'height': ['']
        });
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl').replace('/app_dev.php', '');
        this.urlimg = this.getUri();
    }

    confirmSave(): void{
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            'title' : 'Confirmation modification',
            'content' : 'Voulez-vous vraiment sauvegarder les modifications ?'
        };

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                this.resize();
            }
        });
    }

    getUri(): string {
        const uri = sessionStorage.getItem('im');
        return this.cryptionAesService.decryptMessage(uri);
    }

    crop(): void {
        this.router.navigate(['/administration/resize-photo']);
    }

    goToList(): void {
        this.router.navigate(["/administration/moderation-photo"]);
    }

    resize(): void {
        console.log(this.form.value);
        let data = {
            uri: this.urlimg,
            filters: [
                {
                    resize: [this.form.value.width, this.form.value.height]
                }
            ]
        };
        console.log(data);
        this.administrationApplicatifService.editPhoto(data)
            .subscribe(res => {
                this.resultUrl = res;
                console.log(this.resultUrl);
                const encryptedUrl = this.cryptionAesService.cryptMessage(this.resultUrl);
                sessionStorage.setItem('im', encryptedUrl.toString());
                this.goToList();
            }, err => {
                console.log(err);
            });
    }

    ngOnInit() {
        const img = document.getElementById("img");
        const me = this;
        img.addEventListener('load', function (e) {
            console.log("ready");
            me.form.controls['width'].setValue(img['width']);
            me.form.controls['height'].setValue(img['height']);
            me.form.valueChanges.subscribe(event => {
                const img = document.getElementById("img");
                img['width'] = me.form.controls['width'].value;
                img['height'] = me.form.controls['height'].value;
            });
        })
    }

}
