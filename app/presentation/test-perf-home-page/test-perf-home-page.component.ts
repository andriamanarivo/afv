import { Component, OnInit } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../service/applicatif/home/home.applicatif.service.aci';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { UtilisateurApplicatifServiceACI } from "../../service/applicatif/utilisateur/utilisateur.applicatif.service.aci";
import { AuthenticationApplicatifServiceACI
} from '../../service/applicatif/authentication';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-test-perf-home-page',
    templateUrl: './test-perf-home-page.component.html',
    styleUrls: ['./test-perf-home-page.component.css']
})
export class TestPerfHomePageComponent implements OnInit {
    successMessage: string;
    homes = [];
    email= "";
    active= 0;
    firstcnx = true;

    constructor(private http: Http, public authenticationApplicatifService: AuthenticationApplicatifServiceACI, private userService: UtilisateurApplicatifServiceACI, public homeApplicatifServiceACI: HomeApplicatifServiceACI, private jwtHelper: JwtHelper) { }

    ngOnInit() {
        // this.login();
        // this.getCurrentUser();
        // this.isSuspend();
        // this.getListUserHomePage();
        // this.getSameCity();
        // this.getNbVisiteurAndFavoris();
        // this.getForm();
        // this.getDefualtSearch();
    }

    private extractData(res: any) {
        let data = res.json();
        return data;
    }

    private handleError(error: any) {
        return Observable.throw(error);
    }

    updateStatutUser() {
        const url = environment.baseUrlAppUrl + 'admin/UpdateFieldisActive';
        console.log(this.active);
        const data = { email: this.email.trim(), isActive: this.active, isFirstConnexion: this.firstcnx };
        this.http.post(url, data)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                console.log(res);
                if (res && res.statut !== 500) {
                    this.successMessage = "Statut utilisateur modifié";
                } else if (res && res.statut === 500) {
                    alert('uTILISATEUR NON TROUVé');
                } else {
                    alert('erreur');
                }
            });
    }

    login():void{
        this.authenticationApplicatifService.login("mamisonr+304@gmail.com","123456", "41.204.99.28")
        .subscribe(authentication => {
            console.log(authentication);
        });
    }

    getCurrentUser(): void{
        this.homeApplicatifServiceACI.getUserConnecte().subscribe(userConnecte => {
            console.log(userConnecte);
        });
    }

    getDefualtSearch(): void {
        this.homeApplicatifServiceACI.getListRecherche().subscribe(res => {
            console.log(res);
        });
    }

    getForm(){
        this.homeApplicatifServiceACI.getFormRecherche().subscribe(form => {
           console.log(form);
        });
    }

    getSameCity():void{
        this.homeApplicatifServiceACI.getUserByCity(0, 10, {order:"firstName", desc:0}).subscribe(userLeft => {
            console.log(userLeft);
        });

    }

    getNbVisiteurAndFavoris(): void {
        this.homeApplicatifServiceACI.getNbVisiteurAndFavoris().subscribe(res => {
           console.log(res);
        }, err => {
            console.log(err);
        });
    }
   
    isSuspend(){
        var token = sessionStorage.getItem('id_token');
        let currentUser = this.jwtHelper.decodeToken(token);
        console.log("isSuspend");
        this.userService.verifySuspendedUser(currentUser.uid).subscribe(res => {
           console.log(res);
        });
    }

    getListUserHomePage(): void {
        let data = {
            "uidSearch": "mmm",
            "sexe": "hommeslug",
            "libSexe": "Homme",
            "ageMin": 18,
            "ageMax": 87,
            "rencontre": null,
            "libRencontre": "",
            "localisation": [
              0,
              10000
            ],
            "tendances": "",
            "libTendances": "Soumission",
            "pratiques": [
              "",
              "",
              ""
            ],
            "isConnected": null,
            "isDefault": null,
            "avecPhoto": null,
            "pseudo": "",
            "libelle": "",
            "isSearch": true
          }
        this.homeApplicatifServiceACI.recherche(data, 1, 12, {order:"firstName"}).subscribe((homes) => {
            let homesModified = [];
            if (homes.value) {
                homesModified = homes.value.map(user => {
                    if (!user.photo) {
                        user.defaultpdp = 'assets/img/profil-default.png';
                    }
                    return user;
                });
            }
            this.homes = homesModified;           
        });
    }

}
