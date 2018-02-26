import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { HomeApplicatifServiceACI } from "../../../../service/applicatif/home/home.applicatif.service.aci";
import { SharedService } from 'app/commun';


@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './modal-reportabus.component.html',
    styleUrls: ['./modal-reportabus.component.css']
})
export class ModalReportabusComponent {
    abus = [
        {"idMessage":"1", "message":"Message choquant"},
        {"idMessage":"2", "message":"Faux profil"},
        {"idMessage":"3", "message":"Sollicitation"},
        {"idMessage":"4", "message":"Prostitution ou publicité"},
        {"idMessage":"5", "message":"Autre"}
    ];
    errors = [];
    showInput: boolean = false;
    load:boolean=false;
    

    constructor(
        private homeService: HomeApplicatifServiceACI,
        public dialogRef: MdDialogRef<ModalReportabusComponent>,
        private sharedService: SharedService,
        @Inject(MD_DIALOG_DATA) public data: any) {
        this.sharedService.closeAllModal.subscribe(data => {
            if (data) {
                this.dialogRef.close();
            }
        });
        // this.homeService.getAbus()
        //     .subscribe(res => {
        //         this.abus = res;
        //     }, err => {
        //         console.log(err);
        //     })
    }

    onMotifChanged(): void {
        this.showInput = this.data.motif === "Autre" ? true : false;     
        this.data.motif = this.data.motif === "Autre" ? "" : this.data.motif;
    }

    reportAbus(): void {
        this.errors = [];
        this.verifyData();
        if (this.errors.length === 0) {
            this.reporterAbus(this.data);
        }
    }
    verifyData() {
        if (!this.data.motif) {
            this.errors.push("Veuillez mentionner le motif");
        }
        if (!this.data.contenu) {
            this.errors.push("Veuillez mentionner le contenu");
        }
    }
    reporterAbus(data: any) {
        this.load=true;
        this.homeService.reportAbus(data)
            .subscribe(res => {
                console.log(res);
                this.load=false;                
                if (res.hasError !== 1) {
                    this.dialogRef.close(this.data);
                    this.load = false;                                 
                } else {
                    this.errorCallback(res.message);
                }
            }, err => {
                this.errorCallback(err);
            });
    }


    errorCallback(err): void {
        console.log(err);
        this.errors = [];
        this.errors.push(err);
        this.load=false; 
    }


    onNoClick(): void {
        this.dialogRef.close();
    }


}