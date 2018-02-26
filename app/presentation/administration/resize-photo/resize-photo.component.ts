import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService, CryptionAesService } from 'app/commun';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Element } from '@angular/compiler';
import Cropper from 'cropperjs';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { AppConfig } from 'app/contrainte/config/_app/app.config';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message as MessagePrimeNg } from 'primeng/primeng';



@Component({
    selector: 'app-resize-photo',
    templateUrl: './resize-photo.component.html',
    styleUrls: ['./resize-photo.component.css'],
    providers:[MessageService]
})
export class ResizePhotoComponent implements OnInit, AfterViewInit {
    baseUrl: any;
    msgs: MessagePrimeNg[] = [];

    cropper;
    form: FormGroup;
    imgUri = '';
    resultUrl = '';
    scale_x = 1;
    scale_y = 1;
    initValue = true;    
    rotationOnly=false;

    constructor(
        private cryptionAesService: CryptionAesService,
        private router: Router,
        private sharedService: SharedService,
        private fb: FormBuilder,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private appConfig: AppConfig,
        private messageService: MessageService,
        private administrationApplicatifService: AdministrationApplicatifServiceACI) {
        this.form = this.fb.group({
            'width': new FormControl({ value: '' }),
            'x': new FormControl({ value: '' }),
            'y': new FormControl({ value: '' }),
            'height': new FormControl({ value: '' }),
            'scalex': new FormControl({ value: 1, }),
            'scaley': new FormControl({ value: 1, }),
            'rotate': new FormControl({ value: '' })
        });
        this.form.controls['scalex'].setValue(1);
        this.form.controls['scaley'].setValue(1);
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl').replace('/app_dev.php', '');
        this.imgUri = this.getUri();
        console.log(this.imgUri);
    }

    errorCallback(err): void {       
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    crop(): void{
        this.cropper.crop();
        this.rotationOnly = false;
    }

    clear(): void{
        this.cropper.clear();
    }

    scalexChange(): void{
        this.cropper.scaleX(this.form.controls['scalex'].value);
    }

    scaleyChange(): void{
        this.cropper.scaleY(this.form.controls['scaley'].value);
    }

    ngAfterViewInit(): void {
        const me = this;
        var image = document.getElementById('image');
        image.addEventListener('load', function () {
            me.form.controls['width'].setValue(image['width']);
            me.form.controls['height'].setValue(image['height']);
        });
        this.setCropper();
    }

    confirmSave(): void {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            'title': 'Confirmation modification',
            'content': 'Voulez-vous vraiment sauvegarder les modifications ?'
        };

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data) {
                this.save();
            }
        });
    }

    scalex(): void {
        this.scale_x = this.scale_x * (-1);
        this.cropper.scaleX(0.1);
    }

    scaley(): void {
        this.scale_y = this.scale_y * (-1);
        this.cropper.scaleY(this.scale_y);
    }

    rotate(value) {
        console.log(value);
        this.cropper.rotate(value);
        this.cropper.clear();            
    }

    uncrop(): void{
        this.cropper.clear();  
        this.rotationOnly = true;
    }

    zoom(value): void {
        this.cropper.zoom(value);
    }

    reset(): void {
        this.cropper.reset();
    }

    save(): void {
        console.log(this.form.value);
        // http://bdm.dev.arkeup.com/assets/file_uploaded/square_320_b639ff06555af3b12403c8399da4df1d.jpg              
        //"assets/file_uploaded/b639ff06555af3b12403c8399da4df1d.jpg"            
        //this.imgUri.split("/").slice(3).join('/')  
        if (this.form.value.x < 0 || this.form.value.y < 0) {
            this.errorCallback("Les coordonnées du cropbox doivent être positives : (" + this.form.value.x  + "," + this.form.value.y+ ")");
        } else {                       
            let data = this.createData();
            console.log(data);
            this.administrationApplicatifService.editPhoto(data)
                .subscribe(res => {
                    this.resultUrl = res;
                    console.log(this.resultUrl);
                    const encryptedUrl = this.cryptionAesService.cryptMessage(this.resultUrl);
                    sessionStorage.setItem('im', encryptedUrl.toString());
                    this.goToList();
                    // this.cropper.replace(this.resultUrl);
                    // this.initCropperData();
                    // this.cropper.replace('http://localhost/bdm/assets/img/min-photo.png');
                }, err => {
                    console.log(err);
                });
        }
    }

    updatescalex(value):void{
        this.cropper.scaleX(value);
    }

    updatescaley(value):void{
        this.cropper.scaleY(value);
    }

    createData():any {
        let data;
        if (this.rotationOnly) {
            data = {
                uri: this.imgUri,
                filters: [
                    {
                        crop: null
                    },
                    {
                        rotate: this.form.value.rotate
                    }
                    // ,
                    // {
                    //     rotateXY: {axe: this.cropper.getData().scaleX < 0 ? 'x' : ''}                    
                    // },
                    // {
                    //     rotateXY: {axe: this.cropper.getData().scaleY < 0 ? 'y' : ''}
                    // }
                ]
            }
        } else {
            data = {
                uri: this.imgUri,
                filters: [
                    {
                        crop: {
                            start: [this.form.value.x, this.form.value.y],
                            size: [this.form.value.width, this.form.value.height]
                        }
                    },
                    {
                        rotate: this.form.value.rotate
                    }
                    // ,
                    // {
                    //     rotateXY: {axe: this.cropper.getData().scaleX < 0 ? 'x' : ''}                    
                    // },
                    // {
                    //     rotateXY: {axe: this.cropper.getData().scaleY < 0 ? 'y' : ''}
                    // }
                ]
            }
        }
        return data;
    }

    initCropperData(): void {
        this.cropper.setDragMode("move");
        var image = document.getElementById('image');
        this.cropper.setCanvasData({
            "left": 244.1072010160645,
            "top": 241.93323982847355,
            "width": image['width'],
            "height": image['height'],
            "naturalWidth": image['naturalWidth'],
            "naturalHeight": image['naturalHeight']
        });
        this.cropper.setCropBoxData({
            "left": 244.1072010160645,
            "top": 241.93323982847355,
            "width": image['width'],
            "height": image['height']
        });
        this.cropper.reset();
        this.cropper.clear(); 
    }

    goToList(): void {
        this.router.navigate(["/administration/moderation-photo"]);
    }

    updateSize(): void {
        this.router.navigate(["/administration/edit-photo"]);
    }

    ngOnInit(): void { }

    getUri(): string {
        const uri = sessionStorage.getItem('im');
        return this.cryptionAesService.decryptMessage(uri);
    }

    setCropper() {
        var image = document.getElementById('image');
        const me = this;
        this.cropper = new Cropper(image, {
            checkCrossOrigin: false,
            crop: function (e) {               
                me.form.controls['width'].setValue(e.detail.width);
                me.form.controls['height'].setValue(e.detail.height);
                me.form.controls['rotate'].setValue(e.detail.rotate);
                me.form.controls['x'].setValue(e.detail.x);
                me.form.controls['y'].setValue(e.detail.y);              
            },
            ready: function (e) {
                me.initCropperData();
                // this.cropper.setDragMode("move");
                // this.cropper.setCanvasData({
                //     "left": 244.1072010160645,
                //     "top": 241.93323982847355,
                //     "width": image['width'],
                //     "height": image['height'],
                //     "naturalWidth": image['naturalWidth'],
                //     "naturalHeight": image['naturalHeight']
                // });
                // this.cropper.setCropBoxData({
                //     "left": 244.1072010160645,
                //     "top": 241.93323982847355,
                //     "width": image['width'],
                //     "height": image['height']
                // });
                // this.cropper.reset();
                // this.cropper.scaleX(0.1);
                // me.form.valueChanges.subscribe(event=>{
                //     this.cropper.setCropBoxData
                // });
            }
        });
    }


}
