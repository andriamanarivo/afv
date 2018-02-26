import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { SiteApplicatifServiceACI } from '.';
import {SiteMetierServiceACI } from '../../metier/site/site.metier.service.aci';
import { SiteFactory } from "../../../contrainte/factory/site/site-factory.service";
import { SiteMock, SitesMock } from '../../../donnee/site';

@Injectable()
export class SiteApplicatifService implements SiteApplicatifServiceACI {
    constructor(
        private siteMetierService: SiteMetierServiceACI,
        private siteFactory: SiteFactory
        ) {}

        public scorableField() {
            return this.siteMetierService
                .scorableField();
        }
    public getSites() {
        return this.siteMetierService
            .getSites();
        //return Observable.of(SitesMock);
    }

    public getSite(idSite: string): Observable<any>  {
        return this.siteMetierService
        .getSite(idSite)
        .map(sites => this.siteFactory.siteDtoFromDo(sites));
        //return Observable.of(SiteMock);
    }

    public getSiteInit(): Observable<any>  {
        return this.siteMetierService
        .getSiteInit()
        .map(sites => this.siteFactory.siteDtoFromDo(sites));
    }

    public addUpdateSite(site): Observable<any>  {
        let sitedo = this.siteFactory.siteDoFromDto(site);
        return this.siteMetierService
            .addUpdateSite(sitedo);
    }

    public deleteSite(idSite : string) {
        return this.siteMetierService
            .deleteSite(idSite);
    }

}
