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
export class SiteMetierServiceMock implements SiteMetierServiceACI {

    public scorableField(): Observable<any>  {
        return null;
    }
    public getSites() {
        let result =  Observable.from([
             new Response(new ResponseOptions({body: {data: SitesMock}})) 
        ]);
        return result.map(res => res.json().data);
    }

    public getSitesFailed() {
        return Observable.throw('error');
    }
    

    public getSite(idSite : string) {
        let result = Observable.from([
             new Response(new ResponseOptions({body: {data: SiteMock}})) 
        ]);
        return result.map(res => res.json().data);
    }

    public getSiteInit() : Observable<any>  {
        return null;   
    }
    public addUpdateSite(site) {
        return null;
    }

    public deleteSite(idSite : string) {
        return null;
    }
}