import { Component, OnInit, Inject , Input, NgZone,
    ViewChild, ElementRef,
    OnChanges, SimpleChange, ChangeDetectorRef  } from '@angular/core';

import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';

import { Router } from '@angular/router';

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './modal-confirm.html',
    styleUrls: ['./modal.css']
})
export class ConfirmMessageComponent {
    errors = [];


    constructor(
        public dialogRef: MdDialogRef<ConfirmMessageComponent>,
        private homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private router: Router,
        @Inject(MD_DIALOG_DATA) public data: any) {


    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addToBlackList(pseudo: string): void {
        this.errors = [];
        this.homeApplicatifServiceACI.addToBlackList(pseudo)
            .subscribe(res => {
                console.log(res);
                if (res.result) {
                    // this.router.navigate(['/home/messages']);
                    this.dialogRef.close(this.data);
                    this.router.navigate(['/home/messages']);
                } else {
                    console.log('ERROR');
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

// tslint:disable-next-line:eofline
}