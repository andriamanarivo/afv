/* import { 
    async, ComponentFixture, TestBed, inject,
    fakeAsync, tick
} from '@angular/core/testing';

import { 
    Headers, BaseRequestOptions, RequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod
 } from '@angular/http';

import { MockBackend , MockConnection } from '@angular/http/testing';

import {
    SiteMetierServiceMockProvider,
    SiteMetierServiceMockErr, 
    SiteMetierServiceACI 
} from '.';

import { SiteMock, SitesMock } from '../../../donnee/site';

describe('site metier service', () => {
    let mockBackend: MockBackend;
    let siteMetierService: SiteMetierServiceACI;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            SiteMetierServiceMockProvider,
            //SiteMetierServiceMock,
            MockBackend,
            BaseRequestOptions,
            {
                provide: Http,
                useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
                deps: [ MockBackend, BaseRequestOptions ]
            }
            ]
        });
    });

    beforeEach(inject([ MockBackend, Http , SiteMetierServiceACI],
        (mb: MockBackend, http: Http, siteMetierServiceMock: SiteMetierServiceACI) => {
            mockBackend = mb;
            siteMetierService = siteMetierServiceMock;
    }));

    it('should create', () => {
        expect(siteMetierService).toBeDefined();
    });


    it('should return observable with site array', fakeAsync(() => { 
        siteMetierService.getSites()
        .subscribe(sites => {
            //console.log("sites 0 : ----- ",sites[0]);
            expect(sites.length).toBe(8);
            expect(sites).toEqual(SitesMock);
            expect(sites[0].libSite).toEqual('siteD');
            tick();
        });
    }));

    it('should return observable with site', fakeAsync(() => { 
        siteMetierService.getSite('1')
        .subscribe(site => {
            expect(site.siteName).toEqual('nirinaaa');
            expect(site.idThematique).toEqual('test2slug');
            expect(site.color.length).toBe(2);
            expect(site.color[1].valueColor).toEqual('#881463');
            expect(site.roleDroit.length).toBe(25);
            expect(site.roleDroit[3].idRole).toEqual('abouid');
            expect(site.roleDroit[3].idDroit).toEqual('a7uid');
            //console.log("site : ----- ",site.roleDroit.length);
            tick();
        });
    }));
});

/*
describe('site metier service error', () => {
    let mockBackend: MockBackend;
    let siteMetierService: SiteMetierServiceMockErr;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            SiteMetierServiceMockErr,
            MockBackend,
            BaseRequestOptions,
            {
                provide: Http,
                useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
                deps: [ MockBackend, BaseRequestOptions ]
            }
            ]
        });
    });

    beforeEach(inject([ MockBackend, Http , SiteMetierServiceMockErr],
        (mb: MockBackend, http: Http, siteMetierServiceMock: SiteMetierServiceMockErr) => {
            mockBackend = mb;
            siteMetierService = siteMetierServiceMock;
    }));

    it('should create', () => {
        expect(siteMetierService).toBeDefined();
    });
    
    it('should call handle error from the promise when getSites fails ', fakeAsync(() => { 
        siteMetierService.getSites().then(() => {
            expect(siteMetierService.handleError).toHaveBeenCalled();
            tick();
        });
    }));
    
    it('should return observable with site', fakeAsync(() => { 
        siteMetierService.getSite('1')
        .subscribe(site => {
            
            console.log("site : ----- ",site);
            tick();
        });
    }));
    
});
*/ 