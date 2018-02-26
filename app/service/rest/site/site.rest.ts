import { Injectable, Inject } from '@angular/core';

import { AuthHttp} from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';

import { environment } from '../../../../environments/environment';

@Injectable()
export class SiteRest {
    baseUrlApp: string;
    sitesUrl: string;
    siteUrl: string;

    addUpdateSiteUrl: string;
    deleteSiteUrl: string;

    constructor(
        private authHttp: AuthHttp,
        private appConfig : AppConfig
    ) {
        this.sitesUrl = this.appConfig.getConfig('sitesUrl');
        this.siteUrl = this.appConfig.getConfig('siteUrl');
        this.addUpdateSiteUrl = this.appConfig.getConfig('addUpdateSiteUrl');
        // this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrlApp = environment.baseUrlAppUrl;
        this.deleteSiteUrl = this.appConfig.getConfig('deleteSiteUrl');
    }
    scorableField() {
        const siteUrl = this.baseUrlApp + 'api/scorableField' ;
        return this.authHttp.get(siteUrl);
    }

    getSites() {
        const sitesUrl = this.baseUrlApp  + this.sitesUrl;
        return this.authHttp.get(sitesUrl);
    }
    
    getSite(idSite: string) {
        const siteUrl = this.baseUrlApp + this.siteUrl + '/' + idSite;
        return this.authHttp.get(siteUrl);
    }
    addUpdateSite(site) {
        let addUpdateSiteUrl = this.baseUrlApp  + this.addUpdateSiteUrl;
        //console.log(JSON.stringify(site));
        return this.authHttp.post(addUpdateSiteUrl,site);        
    }

    deleteSite(idSite : string) {
        let deleteSiteUrl = this.baseUrlApp + this.deleteSiteUrl + '/' + idSite;
        return this.authHttp.get(deleteSiteUrl);
    }
}
