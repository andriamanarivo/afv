import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import {SiteMetierServiceACI } from '.';

import { MockBackend , MockConnection } from '@angular/http/testing';
import { 
    Headers, BaseRequestOptions, RequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod
 } from '@angular/http';

import { SiteMock, SitesMock } from '../../../donnee/site';
@Injectable()
export class SiteMetierServiceMockErr implements SiteMetierServiceACI {

    public scorableField(): Observable<any>  {
        return null;
    }
    public getSites() {
        return Observable.throw('error')
        .toPromise()
        .catch(this.handleError);
    }


    public getSite(idSite: string) {
        return Observable.throw('error');
    }

    public getSiteInit(): Observable<any>  {
        return Observable.throw('error');
    }
    public addUpdateSite(site) {
        return Observable.throw('error');
    }

    public deleteSite(idSite : string) {
        return Observable.throw('error');
    }

    public handleError(error: any) {
        return Observable.throw(error);
    }
}