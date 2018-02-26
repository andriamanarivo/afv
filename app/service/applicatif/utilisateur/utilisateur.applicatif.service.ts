import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { UtilisateurApplicatifServiceACI } from '.';
import { UtilisateurMetierServiceACI} from '../../metier/utilisateur/utilisateur.metier.service.aci';
import { UtilisateurCriteria } from '../../../donnee/utilisateur/utilisateur-criteria';
import { UtilisateurFactory } from '../../../contrainte/factory/utilisateur/utilisateur-factory.service';
import { MockUtilisateurs, MockUtilisateur } from '../../../donnee/utilisateur';

@Injectable()
export class UtilisateurApplicatifService implements UtilisateurApplicatifServiceACI {
    public verifySuspendedUser(uid: any) {
         return this.utilisateurMetierService
            .verifySuspendedUser(uid);
    }
    authtoken: string;
    constructor(
        private utilisateurMetierService: UtilisateurMetierServiceACI,
        private utilisateurFactory: UtilisateurFactory
        ) {}

    public getUtilisateurs(userCriteria: UtilisateurCriteria) {
        return this.utilisateurMetierService
            .getUtilisateurs(userCriteria);
            // .map(users => this.utilisateurFactory.utilisateursDtoFromDo(users.items));
        // return Observable.of(MockUtilisateurs);
        // return Observable.of(this.mockPaging(userCriteria,MockUtilisateurs));
    }

    private mockPaging(userCriteria : UtilisateurCriteria, data : any) {
        let items = data.items;
        if (userCriteria.orderColumn && userCriteria.orderDirection){
            items = this.mockSorting(userCriteria, data.items);
        }
        let start = (userCriteria.pageIndex - 1) * userCriteria.pageCount;
        let end = userCriteria.pageCount > -1 ? (start + userCriteria.pageCount) : items.length;
        let itemPaged =  items.slice(start, end);
        let pagedList: any = {};
        pagedList.items = itemPaged;
        pagedList.total = data.total;
        return pagedList;
    }

    private mockSorting(userCriteria: UtilisateurCriteria, data: any) {
        // simple sorting
        return data.sort((previous: any, current: any) => {
        if (previous[userCriteria.orderColumn] > current[userCriteria.orderColumn]) {
            return userCriteria.orderDirection === 'desc' ? -1 : 1;
        } else if (previous[userCriteria.orderColumn] < current[userCriteria.orderColumn]) {
            return userCriteria.orderDirection === 'asc' ? -1 : 1;
        }
        return 0;
        });
    }


    public getUtilisateurDetail(idUser: string): Observable<any>  {
        /*return this.utilisateurMetierService
        .getUtilisateurDetail(idUser);*/
        return Observable.of(MockUtilisateur);
    }

    public getStatutModeration(){
        return this.utilisateurMetierService
            .getStatutModeration();
    }

    public updateUserStatutModerisation(userId, idStatutModerisation) {
        return this.utilisateurMetierService
            .updateUserStatutModerisation(userId, idStatutModerisation);
    }

    public desactiveUsers(idUser: String, statutActivate: number) {
        return this.utilisateurMetierService.desactiveUsers(idUser, statutActivate);
    }

    public activeUsers(idUser: String){
        return this.utilisateurMetierService.activeUsers(idUser);
    }
    public siteRoles(idSite: String) {
        return this.utilisateurMetierService.siteRoles(idSite);
    }

    public userRoles(idUser: String) {
        return this.utilisateurMetierService.userRoles(idUser);
    }
    public updateUserRoles(idUser: string, roles) {
        return this.utilisateurMetierService.updateUserRoles(idUser, roles);
    }
}
