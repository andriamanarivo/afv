import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { UtilisateurRest} from '../../rest/utilisateur/utilisateur.rest';
import { MockUtilisateurs, MockUtilisateur, UtilisateurCriteria } from '../../../donnee/utilisateur';

import { UtilisateurMetierServiceACI } from '.';
import { UtilsService } from 'app/commun/utils.service';

@Injectable()
export class UtilisateurMetierService implements UtilisateurMetierServiceACI {
    public verifySuspendedUser(uid: any) {
         return this.utilisateurRest.verifySuspendedUser(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    constructor(
    private utilisateurRest: UtilisateurRest,
    private utilsService: UtilsService) { }
    public getUtilisateurs(userCriteria: UtilisateurCriteria): Observable<any>  {
        return this.utilisateurRest.getUtilisateurs(userCriteria)
            .map((res) => {return this.extractUsersData(res, this); })
            .catch(this.handleError);

    }

    private extractUsersData(res, me) {
        const data = res.json();
        if (Array.isArray(data.items)) {
            for (const i in data.items) {
                if (data.items.hasOwnProperty(i)) {
                    const options = {
                        year: 'numeric', month: 'numeric', day: 'numeric',
                        hour: 'numeric', minute: 'numeric', second: 'numeric',
                        hour12: false
                    };
                    data.items[i].dateNaissance = new Intl.DateTimeFormat().format(new Date(data.items[i].dateNaissance));
                    data.items[i].dateCreation = new Intl.DateTimeFormat('fr-Fr', options).format(new Date(data.items[i].dateCreation));
                    if (data.items[i].statutModeration) {
                        data.items[i].statutModeration = me.utilsService.capitalizeFirstLetter(data.items[i].statutModeration);
                    }
                    if (data.items[i].statutCompte) {
                        data.items[i].statutCompte = me.utilsService.capitalizeFirstLetter(data.items[i].statutCompte);
                    }
                }
            }
        }
        return data;
    }


    public getUtilisateurDetail( idUser: string): Observable<any>  {

        return this.utilisateurRest.getUtilisateurDetail(idUser)
            .map(this.extractData)
            .catch(this.handleError);

    }

    private extractData(res: any) {
        let data = res.json();
        return data;
    }
    private handleError(error: any) {
        return Observable.throw(error.json());
    }

     public getStatutModeration(){
          return this.utilisateurRest.getStatutModeration()
             .map(this.extractData)
             .catch(this.handleError);
    }

    public updateUserStatutModerisation(userId : string, idStatutModerisation : string){
        return this.utilisateurRest.updateUserStatutModerisation(userId, idStatutModerisation)
             .map(this.extractData)
             .catch(this.handleError);
    }

	public desactiveUsers(idUser: String, statutActivate: number) {
        return this.utilisateurRest.desactiveUsers(idUser, statutActivate)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public activeUsers(idUser: String) {
         return this.utilisateurRest.activeUsers(idUser)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public siteRoles(idSite: String) {
        return this.utilisateurRest.siteRoles(idSite)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public userRoles(idUser: String) {
        return this.utilisateurRest.userRoles(idUser)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public updateUserRoles(idUser: string, roles) {
        return this.utilisateurRest.updateUserRoles(idUser, roles)
        .map(this.extractData)
        .catch(this.handleError);
    }

}
