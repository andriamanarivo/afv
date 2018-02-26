import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../commun/shared-service';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-abus-detail',
    templateUrl: './abus-detail.component.html',
    styleUrls: ['./abus-detail.component.css']
})
export class AbusDetailComponent implements OnInit {
    currentAbus: any;
    errors = [];
    successMessage = "";
    loading:boolean=false;
    constructor(private route: ActivatedRoute, 
        private sharedService: SharedService, private adminService: AdministrationApplicatifServiceACI,
        private router: Router) {
        this.sharedService.showDetailAbusEvent.subscribe(data => {
            console.log(data);
            if (data.row && data.row.uid) {
                this.currentAbus = data.row;
            } else {
                this.getDetailAbus();
            }
        });
    }

    getDetailAbus() {
        this.loading =true;
        let uid = this.route.snapshot.params['id'];
        this.adminService.getDetailAbus(uid)
            .subscribe(res => {
                console.log(res);
                let idAction = '';
                if(this.currentAbus)  idAction = this.currentAbus.idAction;
                this.currentAbus = res;
                this.currentAbus.idAction = idAction;
                this.loading = false;
            }, err => {
                this.loading = false;
                console.log(err);
            });
    }

    validerAction(): void {
        console.log(this.currentAbus);
        this.successMessage = "";
        this.errors = [];
        let data = {
            idAction: this.currentAbus.idAction,
            uidAbus: this.currentAbus.uid
        }
        console.log(data);
        this.loading =true;
        if (data.idAction) {
            this.adminService.performAction(data)
                .subscribe(res => {
                    console.log(res);
                    this.loading = false;
                    if (!res.error) {
                        switch (this.currentAbus.idAction) {
                            case '1':
                                this.successMessage = res.status_desc + " à l'utilisateur : " + this.currentAbus.pseudoRep ;
                                break;
                            case '2':
                                this.successMessage = "L'utilisateur : " + this.currentAbus.pseudoRep + " a été suspendu";
                                break;
                            case '3':
                                this.successMessage = "Aucune action faite, l'abus a été traité";
                                break;
                            default:
                                break;
                        }
                        this.getDetailAbus();
                    } else {
                        console.log(res.error);
                        if(res.status_desc === "USER_ALREADY_SUSPENDED"){
                             this.errors.push("Utilisateur déjà suspendu");
                        }
                    }
                }, err => {
                    console.log(err);
                    this.loading = false;
                });
        } else {
            this.errors.push("Veuillez séléctionner l'action à entreprendre.");
            this.loading = false;
        }
    }

    goToListAbus(): void {
        this.router.navigate(["/administration/abus"]);
    }

    ngOnInit() {
    }

}
