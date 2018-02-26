import { Injectable, Inject } from '@angular/core';
// import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { AuthHttp} from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';
import { UtilisateurCriteria }       from '../../../donnee/utilisateur/utilisateur-criteria';

import { environment } from '../../../../environments/environment';

@Injectable()
export class UtilisateurRest {


    baseUrlApp: string;
    utilisateursUrl: string;
    utilisateurDetailUrl: string;

    idSite: string;
    constructor(
        private authHttp: AuthHttp,
        private appConfig: AppConfig
    ) {
        this.utilisateursUrl = this.appConfig.getConfig('utilisateursUrl');
        this.utilisateurDetailUrl = this.appConfig.getConfig('utilisateurDetailUrl');
        this.idSite = this.appConfig.getSiteIdByLocation();
        // this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrlApp = environment.baseUrlAppUrl;
    }
 

    getUtilisateurs(userCriteria: UtilisateurCriteria) {
        const utilisateursUrl = this.baseUrlApp  + this.utilisateursUrl;
        return this.authHttp.post(utilisateursUrl, userCriteria);
    }

    getUtilisateurDetail(idUser: string) {
        const utilisateurDetailUrl = this.baseUrlApp  + idUser + '/' + this.utilisateurDetailUrl;
        return this.authHttp.get(utilisateurDetailUrl);
    }

    verifySuspendedUser(uid: any) {
        const data = { uidUser:uid};
        const url = this.baseUrlApp + 'api/isSuspend';
        return this.authHttp.post(url, data);
    }

	getStatutModeration() {
        const statutUrl = this.baseUrlApp + 'api/admin/list/moderation';
        return this.authHttp.get(statutUrl);
    }

    updateUserStatutModerisation(userId: string, idStatutModerisation: string){
        const statutUrl = this.baseUrlApp + 'api/admin/moderate';

        const statutData = {
            'idModeration': idStatutModerisation,
            'idUser': userId
        };
        return this.authHttp.put(statutUrl, statutData);
    }

    desactiveUsers(idUser: String, statutActivate: number) {
        let url = 'api/utilisateur/suspendre';

        if (statutActivate === 1) {
            url = 'api/utilisateur/activer';
        }

        const AdmRejectMailUrl = this.baseUrlApp + url;
        const userData = {
            'uid': idUser,
        }
        return this.authHttp.post(AdmRejectMailUrl, userData);
    }

    activeUsers(idUser) {
        const Url = this.baseUrlApp + 'api/admin/activeCompteUser';
        const userData = {
            'uid': idUser,
        };
        return this.authHttp.post(Url, userData);
    }

    siteRoles(idSite: String) {
        const siteRoleUrl = this.baseUrlApp + 'api/admin/'  + idSite + '/roles';
        return this.authHttp.get(siteRoleUrl);
    }

    public userRoles(idUser: String) {
        const userRoleUrl = this.baseUrlApp + 'getRole/'  + idUser ;
        return this.authHttp.get(userRoleUrl);
    }

    updateUserRoles(idUser: String, roles) {
        const Url = this.baseUrlApp + 'api/admin/roles';
        const userData = {
            'uid': idUser,
            'roles': roles
        };
        return this.authHttp.post(Url, userData);
    }
}