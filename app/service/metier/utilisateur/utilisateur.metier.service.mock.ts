import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {UtilisateurMetierServiceACI } from '.';
import { UtilisateurCriteria } from '../../../donnee/utilisateur/utilisateur-criteria';

import { MockUtilisateurs, MockUtilisateur } from '../../../donnee/utilisateur';

@Injectable()
export class UtilisateurMetierServiceMock implements UtilisateurMetierServiceACI {
    public verifySuspendedUser(uid: any) {
        throw new Error('Method not implemented.');
    }


    public getUtilisateurs(userCriteria: UtilisateurCriteria) {
        return Observable.of(MockUtilisateurs);
    }


     public getUtilisateurDetail(idUser: string) {
        return Observable.of(MockUtilisateur);
    }

    public getStatutModeration(){
        return null;
    }

    public updateUserStatutModerisation(userId: string, idStatutModerisation: string) {
        return null;
    }

    public desactiveUsers(idUser: String, statutActivate: number) {
        return null;
    }

    public activeUsers(idUser: String) {
        return null;
    }

    public siteRoles(idSite: String) {
        return null;
    }

    public userRoles(idUser: String) {
        return null;
    }
    public updateUserRoles(idUser: string, roles) {
        return null;
    }
}