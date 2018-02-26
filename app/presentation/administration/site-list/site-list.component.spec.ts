
import { 
  async, ComponentFixture, TestBed,
  inject, fakeAsync, tick
} from '@angular/core/testing';

import { SiteListComponent } from './site-list.component';


import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Ng2SmartTableModule } from 'ng2-smart-table';

//import { UserProfilComponent } from '../../presentation/users'
import { SiteApplicatifServiceACI } from '../../../service/applicatif/site';
import { ApplicatifSpecModule } from "../../../service/applicatif/applicatif.spec.module";

import { LoaderModule } from "../../../presentation/loader";
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';
import { 
    Headers, BaseRequestOptions, RequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod
 } from '@angular/http';

 import { Router, ActivatedRoute, Params } from '@angular/router';
 

describe('SiteListComponent', () => {
  let component: SiteListComponent;
  let fixture: ComponentFixture<SiteListComponent>;
  let siteApplicatifService: SiteApplicatifServiceACI;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ApplicatifSpecModule,
        RouterTestingModule,
        AlertModule.forRoot(),
        LoaderModule,
        ModalModule.forRoot(),
        Ng2SmartTableModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: httpFactory,
            deps: [Http]
        })
      ],
      declarations: [ SiteListComponent ],
      providers: [
        BsModalRef
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([SiteApplicatifServiceACI],
        (siteApplicatifServiceMock: SiteApplicatifServiceACI) => {
            siteApplicatifService = siteApplicatifServiceMock;
    }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return observable with site array', fakeAsync(() => { 
      siteApplicatifService.getSites()
      .subscribe(sites => {
          expect(sites.length).toBe(8);
          expect(sites[0].libSite).toEqual('siteD');
          tick();
      });
  }));

  /* it('should delete site', fakeAsync(() => { 
      siteApplicatifService.deleteSite('sitk7x5rsite')
      .subscribe(sites => {
          expect(sites.length).toBe(7);
          let deletedSite = sites.find(site => site.uidSite === 'sitk7x5rsite');
          expect(deletedSite).toBe(undefined);
          let notDeletedSite = sites.find(site => site.uidSite === 'sitn8e5asite');
          expect(deletedSite.uidSite).toBe('sitn8e5asite');
          tick();
      });
  })); */

  

});

export function httpFactory(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
