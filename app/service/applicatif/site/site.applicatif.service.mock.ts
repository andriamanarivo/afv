import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import {SiteApplicatifServiceACI } from '.';

import { SiteMock,SitesMock } from '../../../donnee/site';

@Injectable()
export class SiteApplicatifServiceMock implements SiteApplicatifServiceACI {

    public scorableField() {
        return null;
    }
    public getSites() {
        return Observable.of(SitesMock);
    }

    public getSite(idSite : string) {
        return Observable.of(SiteMock);
    }
    public getSiteInit() {
        return Observable.of(SiteMock);
    }
    public addUpdateSite(site) {
        return null;
    }

    public deleteSite(idSite : string) {
        let sites = SitesMock;
        sites = sites.filter(site => site.uidSite !== idSite);
        return Observable.of(sites);
    }
}