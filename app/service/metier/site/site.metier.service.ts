import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { SiteRest} from '../../rest/site/site.rest';
import { AdministrationRest} from '../../rest/administration/administration.rest';
import { SiteMock, SiteInit } from '../../../donnee/site';

import { SiteMetierServiceACI } from '.';

@Injectable()
export class SiteMetierService implements SiteMetierServiceACI {

    constructor(
        private siteRest: SiteRest
        // private administrationRest : AdministrationRest
    ) { }
    public scorableField(): Observable<any>  {
        return this.siteRest.scorableField()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getSites(): Observable<any>  {
        return this.siteRest.getSites()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getSite(idSite: string): Observable<any>  {
        return this.siteRest.getSite(idSite)
            .map(this.extractData)
            .catch(this.handleError);
        // return Observable.of(SiteMock);
    }

    public getSiteInit(): Observable<any>  {
        return Observable.of(SiteInit);
    }

    public addUpdateSite(site): Observable<any>  {
        return this.siteRest.addUpdateSite(site);
        // return null;
    }

    public deleteSite(idSite: string) {
        return this.siteRest.deleteSite(idSite)
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
}