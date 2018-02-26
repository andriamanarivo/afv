import { Component, OnInit } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-souscription-detail',
    templateUrl: './souscription-detail.component.html',
    styleUrls: ['./souscription-detail.component.css']
})
export class SouscriptionDetailComponent implements OnInit {
    public souscription;
    public id: string;
    constructor(
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params["id"];
            this.homeApplicatifServiceACI.getSouscriptionDetail(this.id).subscribe(souscription => {
                this.souscription = souscription;
            });
        });
    }
    renouveler(id: string) {

    }
    resilier(id: string) {

    }

}
