import { element } from 'protractor';

import { async, ComponentFixture, TestBed, inject, fakeAsync, tick  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { ReCaptchaService } from '../../service/applicatif/authentication/recaptcha.service';


import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';
import { Http, HttpModule , RequestOptions  } from '@angular/http';
import { Router } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';
import { CryptionAesService } from '../../commun/cryption-aes.service';

import { AuthenticationComponent } from './authentication.component';
import { ControlMessagesComponent } from '../../presentation/shared/control-messages/control-messages.component';

import { HomeRest } from '../../service/rest/home/home.rest';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { LoaderComponent } from '../../presentation/loader/loader.component';
import { AuthenticationApplicatifServiceACI,
   AuthenticationApplicatifServiceMock,
   AuthenticationApplicatifServiceMockProvider,
   AuthenticationApplicatifService
   } from '../../service/applicatif/authentication';

   import { AuthenticationMetierServiceACI,
    AuthenticationMetierServiceMock,
    AuthenticationMetierServiceMockProvider,
    AuthenticationMetierService
    } from '../../service/metier/authentication';

  import { AppConfig } from '../../contrainte/config/_app/app.config';
  import { AppConfigMock } from '../../contrainte/config/_app/app.config.mock';
  //
  import { APP_INITIALIZER } from '@angular/core';

  import { StorageManagementSupport } from '../../commun/storage.management';
  import { SharedService } from '../../commun/shared-service';
  import { SharedDataService } from '../../presentation/shared/service/shared-data.service';

  import {
    InscriptionApplicatifServiceProvider,
    InscriptionApplicatifService,
    InscriptionApplicatifServiceACI,
    InscriptionApplicatifServiceMockProvider,
    InscriptionApplicatifServiceMock
  } from '../../service/applicatif/inscription';

  import { HomeApplicatifService, HomeApplicatifServiceMock } from '../../service/applicatif/home';
  import { HomeApplicatifServiceProvider, HomeApplicatifServiceMockProvider } from '../../service/applicatif/home';
  import { HomeMetierService, HomeMetierServiceMock, HomeMetierServiceACI,
    HomeMetierServiceProvider, HomeMetierServiceMockProvider
  } from '../../service/metier/home';

  import {  } from '../../service/metier/home';


import { ModalModule } from 'ngx-bootstrap/modal';


  import { BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
// angular material
import {
  MdInputModule, MdSelectModule, MdProgressBarModule, MdAutocompleteModule,
  MdProgressSpinnerModule,
  MdCheckboxModule, MdTabsModule, MdSidenavModule , MaterialModule,
  MdDatepickerModule, MdNativeDateModule, DateAdapter, NativeDateAdapter,
  MD_DATE_FORMATS
  // , MD_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';

import {Routes} from '@angular/router';
import {Location} from '@angular/common';

export function httpFactory(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

export function authHttpMockServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
     headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => sessionStorage.getItem('id_token')),
    }), http, options);
}

export function appConfigServiceFactory(configMock: AppConfigMock) {
  return () => configMock.load();
}

// mock component
@Component({
  template: `<div>
  splashcreen
  </div>`
})
export class SplashcreenComponent {
}

@Component({
  template: `
  <div>
    <div>
      Home
    </div>
    <div>
      <router-outlet></router-outlet>
    </div>
  </div>`
})
export class HomeComponent {
}

@Component({
  template: `<div>
  search
  </div>`
})
export class SearchComponent {
}

@Component({
  template: `
  <div>
    App component
  </div>
  <router-outlet></router-outlet>`
})
export class AppComponent {
}

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'splashcreen', component: SplashcreenComponent},
  { path: 'home', component: HomeComponent,
  children: [
    {path: 'user', component: SearchComponent}
  ]
  }
];


describe('AuthenticationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;
  /* const element = fixture.nativeElement; */

  let authenticationApplicatifService: AuthenticationApplicatifServiceACI;


  let router: Router;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, FormsModule,
        MdInputModule,
        MdSelectModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdTabsModule,
        MdCheckboxModule,
        MdAutocompleteModule,
        MdSidenavModule,
        ReCaptchaModule,
        BrowserAnimationsModule,
      NoopAnimationsModule,
        ModalModule.forRoot(),
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: httpFactory,
          deps: [Http]
      }),
      RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        AuthenticationComponent,
        ControlMessagesComponent,
        SplashcreenComponent,
        HomeComponent,
        SearchComponent,
        AppComponent,
        LoaderComponent
       ],
      providers:    [
        ReCaptchaService,
        AuthenticationApplicatifServiceMock,
          AuthenticationApplicatifService, AuthenticationApplicatifServiceACI,
         { provide: AuthenticationApplicatifService, useClass: AuthenticationApplicatifServiceMock },
         { provide: AuthenticationApplicatifServiceACI, useClass: AuthenticationApplicatifServiceMock },
        AuthenticationMetierServiceMockProvider, AuthenticationMetierService, AuthenticationMetierServiceACI,
        AuthHttp,
        JwtHelper,
        {
          provide: AuthHttp,
          useFactory: authHttpMockServiceFactory,
          deps: [Http, RequestOptions]
        },
        AppConfigMock,
        {provide: AppConfig, useClass: AppConfigMock},
        {
          provide: APP_INITIALIZER,
          useFactory: appConfigServiceFactory ,
          deps: [AppConfigMock], multi: true
          },
        CryptionAesService,
        StorageManagementSupport,
        SharedService, SharedDataService,
        InscriptionApplicatifServiceMockProvider, InscriptionApplicatifServiceMock, InscriptionApplicatifServiceACI,
        HomeApplicatifService, HomeApplicatifServiceMockProvider, HomeApplicatifServiceMock,
        HomeMetierService, HomeMetierServiceMockProvider, HomeMetierServiceMock,
        HomeRest, BsModalRef, BsModalService
      ]
    })
    .compileComponents();
    // authenticationApplicatifService = TestBed.get(AuthenticationApplicatifService);

    /* router = TestBed.get(Router);
    location = TestBed.get(Location); */

  }));

  beforeEach(inject([AuthenticationApplicatifService], (authenticationSA: AuthenticationApplicatifService) => {
    authenticationApplicatifService = authenticationSA;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* beforeEach(inject([AuthenticationComponent], (AuthenticationForm: AuthenticationComponent) => {
    component = AuthenticationForm;
  })); */

  /* it('should send credentials on submit', () => {
    let loginBtn: DebugElement = fixture.debugElement.query(By.css('.btn_connexion'));
    loginBtn.nativeElement.click();
    element.querySelector('#username').value = 'mamisonr+305@gmail.com';
    element.querySelector('#password').value = '123456';

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    expect(component.login).toHaveBeenCalledWith({
      title: 'email',
      primaryImage: 'password'
    });
  }); */

/* 
  it('should create an instance', () => {
    fixture.detectChanges();
    console.log('-------------------inject loggedIn');
    const loggedIn = authenticationApplicatifService.loggedIn();
    console.log('------------------- loggedIn', loggedIn);
    expect(authenticationApplicatifService).toBeDefined();
  });
 */

  /* it('email field validity', () => {
    let errors = {};
    let email = component.form.controls['email'];
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy(); 
  }); */


  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

