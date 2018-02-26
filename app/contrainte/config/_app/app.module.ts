
import { NgModule, ApplicationRef } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import {NgxPaginationModule} from 'ngx-pagination';
import { PagerService } from '../../../service/pager.service';

import { Ng2IdleModule } from '../../../commun/custom-idle/module';

import { ApplicatifModule } from '../../../service/applicatif/applicatif.module';
// SharedPipeModule
/* import { TwoColumnPipe } from '../../../presentation/shared/shared-pipe/two-column.pipe';
 */
import { SharedPipeModule } from '../../../presentation/shared/shared-pipe/shared-pipe.module';
// Module metier:
import { MetierModule } from '../../../service/metier/metier.module';
// Module business-delegate:
import { RestModule } from '../../../service/rest/rest.module';

import { CryptionAesService } from '../../../commun/cryption-aes.service';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { TchatService, ChatMucService } from '../../../commun';
import { LogoutService } from '../../../commun/logout-service';
import { AutorisationService } from '../../../commun/autorisation.service';
import { UtilsService } from '../../../commun/utils.service';
import { StorageManagementSupport } from '../../../commun/storage.management';
import { XlsxService } from '../../../commun/xlsx.service';


import { LoaderModule } from '../../../presentation/loader';
import { AdministrationModule } from '../../../presentation/administration';
import { InscriptionModule } from '../../../presentation/inscription';
import { AuthenticationModule } from '../../../presentation/authentication';
import { UsersModule } from '../../../presentation/users/users.module';

// import { UtilisateurCriteria }       from '../../../donnee/utilisateur/utilisateur-criteria';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

 /* import { ReCaptchaModule } from 'angular2-recaptcha'; */
  import { ReCaptchaService } from '../../../service/applicatif/authentication/recaptcha.service';


import {HomePresentationModule } from '../../../presentation/home-presentation/home-presentation.module';

// angular material
import {
    MdInputModule, MdSelectModule, MdProgressBarModule, MdAutocompleteModule, MdCheckboxModule, MdTabsModule,
        MdDatepickerModule, MdNativeDateModule, DateAdapter, NativeDateAdapter,
        MD_DATE_FORMATS, MdSliderModule, MdRadioModule, MdButtonModule, MdProgressSpinnerModule
    // , MD_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';


import { BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdSidenavModule , MaterialModule, MdCardModule} from '@angular/material';
import { SidebarModule } from 'primeng/primeng';
/* import { InputMaskModule } from 'ng2-inputmask'; */

import {InputMaskModule } from 'primeng/primeng';



import {
   FormsModule
   , ReactiveFormsModule
   } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';
/* import { httpFactory } from '../../factory/_app/translate.factory'; */

import { Http, HttpModule , RequestOptions  } from '@angular/http';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';

import { AuthenticationApplicatifService,
AuthenticationApplicatifServiceProvider } from '../../../service/applicatif/authentication';

import { AuthGuardApplicatif } from '../../../service/applicatif/authentication/auth-guard.applicatif.service';
import { RoleGuardApplicatif } from '../../../service/applicatif/authentication/role-guard.applicatif.service';
import { AdminGuardApplicatif } from '../../../service/applicatif/authentication/admin-guard.applicatif.service';
import { SplashGuardApplicatifService } from '../../../service/applicatif/authentication/splash-guard-applicatif.service';

import { AppComponent } from '../../../presentation/_app';
import { AppState, InternalStateType } from './app.service';

import {
  MainUsersComponent,
   ProfilComponent ,
   ModifProfilComponent,
      headerComponent,
      footerComponent,
      sideComponent,
      FavorisComponent,
      visiteurComponent,
      ListeComponent,
      SouscriptionComponent,
      SouscriptionDetailComponent
} from '../../../presentation/home-presentation';


import {
  InscriptionApplicatifServiceProvider,
  InscriptionApplicatifService,
  InscriptionApplicatifServiceMockProvider,
  InscriptionApplicatifServiceMock

} from '../../../service/applicatif/inscription';


import {
  AuthenticationRest
} from '../../../service/rest/authentication/authentication.rest';
import {
  AuthenticationMetierServiceProvider,
  AuthenticationMetierService
} from '../../../service/metier/authentication';

import {
  InscriptionMetierServiceProvider,
  InscriptionMetierService,
  InscriptionMetierServiceMockProvider,
  InscriptionMetierServiceMock
} from '../../../service/metier/inscription';

import { PseudoApplicatifServiceProvider, PseudoApplicatifService } from '../../../service/applicatif/pseudo';
import {
  PseudoMetierServiceProvider,
  PseudoMetierService
} from '../../../service/metier/pseudo';
import {
  PseudoRest
} from '../../../service/rest/pseudo/pseudo.rest';


import { CountryApplicatifServiceProvider, CountryApplicatifService } from '../../../service/applicatif/country';
import {
  CountryMetierServiceProvider,
  CountryMetierService
} from '../../../service/metier/country';
import {
  CountryRest
} from '../../../service/rest/country/country.rest';


import {
  InscriptionRest
} from '../../../service/rest/inscription/inscription.rest';
import { HomeRest } from '../../../service/rest/home/home.rest';

import { SplashcreenComponent } from '../../../presentation/splashcreen/splashcreen.component';



import { HomePresentationComponent } from '../../../presentation/home-presentation';
import { TchatForbiddenService } from '../../../presentation/home-presentation/tchat/service/tchat.forbidden.service';
import { TchatMessageService } from '../../../presentation/home-presentation/tchat/service/tchat.message.service';
import { TchatConnectionService } from '../../../presentation/home-presentation/tchat/service/tchat.connection.service';
import { TchatPresenceService } from '../../../presentation/home-presentation/tchat/service/tchat.presence.service';
import { TchatRoomService } from '../../../presentation/home-presentation/tchat/service/tchat.room.service';
import { TchatReceiptService } from '../../../presentation/home-presentation/tchat/service/tchat.receipt.service';

import { ChatComponent } from '../../../presentation/home-presentation/profil/chat/chat.component';
import { rechercheComponent } from '../../../presentation/home-presentation/recherche/recherche.component';
import { ContactMessageComponent } from '../../../presentation/home-presentation/contact-message/contact-message.component';
//

import { HomeApplicatifService, HomeApplicatifServiceMock } from '../../../service/applicatif/home';
import { UserApplicatifServiceProvider } from '../../../service/applicatif/user';

import { HomeApplicatifServiceProvider, HomeApplicatifServiceMockProvider } from '../../../service/applicatif/home';


import { HomeMetierServiceProvider, HomeMetierService } from '../../../service/metier/home';


import { ConnectivityService } from '../../../commun/connectivity.service';
import { PseudoValidationService } from '../../../contrainte/rule/pseudo-validation.service';
import { ValidationFactoryService } from '../../../contrainte/rule/validation.factory.service';

import { AppRoutingModule } from './app-routing.module';


import '../../../../styles/styles.scss';
import '../../../../styles/headings.css';
import {ConstantService} from './constant.service';
import { SharedService } from '../../../commun/shared-service';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { GrowlModule } from 'primeng/primeng';
/* import { EditorModule } from 'primeng/primeng'; */

import { TestPerfModule } from '../../../presentation/test-perf-home-page/test-perf-home-page.module';



/*
import {
        AuthenticationComponent,ForgotpasswordPresentationComponent, PasswordRenderMailComponent
} from '../../../presentation/authentication';
*/



/* import { ControlMessagesComponent } from '../../../presentation/shared/control-messages/control-messages.component'; */
import { ControlMessagesModule } from '../../../presentation/shared/control-messages/control-messages.module';


//
// Application wide providers
const APP_PROVIDERS = [
  // ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

export function httpFactory(http: Http) {
  // useFactory: (http: Http) => new TranslateStaticLoader(http, '../../../../assets/i18n', '.json')
  // return new TranslateStaticLoader(http, '../../../../assets/i18n', '.json');
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}


export function appConfigServiceFactory(config: AppConfig) {
  //      useFactory: (config: AppConfig) => () => config.load(),
  return () => config.load();
}

/*
export function tokensessionStorageGetter() {
  return sessionStorage.getItem('id_token');
}
*/

//

function getSiteByLocation(appConfig: AppConfig) {
  const envLocation = window.location.hostname;

  switch (envLocation) {
      case appConfig.getConfig('site1.sitename'):
          return appConfig.getConfig('site1.Id');
        case appConfig.getConfig('site2.sitename'):
          return appConfig.getConfig('site2.Id');
        case appConfig.getConfig('site3.sitename'):
          return appConfig.getConfig('site3.Id');
      default:
          return appConfig.getConfig('site4.Id');
  }
}

export function authHttpServiceFactory(http: Http, options: RequestOptions, appConfig: AppConfig) {

  const env = getSiteByLocation(appConfig);
  // console.log("env",env);

  // ne pas supprimer
  // utiisation future


  // if (options) {
  //    if(!options.headers.has('idSite')){
  //        options.headers.append('idSite', env);
  //    }
  // }
    return new AuthHttp(new AuthConfig({
     headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => sessionStorage.getItem('id_token')),
    }), http, options);




}

import {SliderModule, InputTextModule, TabViewModule, CodeHighlighterModule} from 'primeng/primeng';
import { SplashcreenModule } from 'app/presentation/splashcreen/splashcreen.module';
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,

    HomePresentationComponent,
    /* TchatComponent, */
    ChatComponent,
      rechercheComponent,
    ContactMessageComponent,
    // AuthenticationComponent,ForgotpasswordPresentationComponent, PasswordRenderMailComponent,

    /*InscriptionComponent, VousetesPresentationComponent, StatutPresentationComponent,
    OrientationPresentationComponent, SituationPresentationComponent,
    TendancePresentationComponent,
    PratiquePresentationComponent, RecherchePresentationComponent, RenderMailComponent,
    ComptePresentationComponent, InscriptionConfirmPresentationComponent,*/
    SplashcreenComponent,
    /* TwoColumnPipe, */
    /* ControlMessagesComponent, */
     MainUsersComponent,
     ProfilComponent,
     ModifProfilComponent,
     FavorisComponent,
      visiteurComponent,
      headerComponent,
      footerComponent,
      sideComponent,
      ListeComponent,
      SouscriptionComponent,
      SouscriptionDetailComponent

  ],
  imports: [
      SliderModule,
    AdministrationModule,
    InscriptionModule,
    TestPerfModule,
    LoaderModule,
    UsersModule,
    ControlMessagesModule,
    ApplicatifModule,
    SharedPipeModule,
    MetierModule,
    RestModule,
    NgxPaginationModule,
    SplashcreenModule,
    /* ReCaptchaModule, */
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HomePresentationModule,
    AuthenticationModule,
    // Angular material
    MdInputModule,
    MdSelectModule,
    MdProgressBarModule,
    MdTabsModule,
    MdCheckboxModule,
    MdAutocompleteModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MdSidenavModule,
    MdSliderModule,
    MdRadioModule,
    MdButtonModule,
    MdCardModule,
    MdProgressSpinnerModule,
    GrowlModule,
    InputMaskModule,
    /* EditorModule, */

    // NoopAnimationsModule,
    MdDatepickerModule, MdNativeDateModule,
    /* HttpClientModule, */
    AppRoutingModule,
    SidebarModule,
    /* InputMaskModule, */
    Ng2IdleModule.forRoot(),
    TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: httpFactory,
          deps: [Http]
      })
  ],

  exports: [
    TranslatePipe
    // ControlMessagesComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CryptionAesService,
    TchatService,
    LogoutService,
    TchatForbiddenService,
    TchatMessageService,
    TchatRoomService,
    TchatReceiptService,
    TchatPresenceService,
    TchatConnectionService,
    ChatMucService,
    PhotoPdp,
    PagerService,

    // UtilisateurCriteria,
   //  HomeApplicatifService,
    UserApplicatifServiceProvider,
    // deplacé dans inscription module
    // InscriptionResolve,
    ReCaptchaService,
    // Using Real
    InscriptionApplicatifServiceProvider,

    InscriptionApplicatifService,

    /*InscriptionApplicatifServiceMockProvider,
    InscriptionApplicatifServiceMock,*/

    InscriptionApplicatifService,
    AuthenticationMetierServiceProvider,
    AuthenticationMetierService,

    HomeApplicatifServiceProvider,
    HomeApplicatifService,
    // HomeApplicatifServiceMockProvider,
    // HomeApplicatifServiceMock,
    CountryApplicatifServiceProvider,
    AuthenticationRest,
    CountryApplicatifService,
    CountryMetierServiceProvider,
    CountryMetierService,
    CountryRest,
    PseudoApplicatifServiceProvider,
    PseudoApplicatifService,
    PseudoMetierServiceProvider,
    PseudoMetierService,
    PseudoValidationService,
    ValidationFactoryService,
    PseudoRest,
    // Angular material
     // {provide: MD_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'always' }},
    // HomeApplicatifServiceProvider,

    // Using real
    InscriptionMetierServiceProvider,
    InscriptionMetierService,
    InscriptionRest,
    HomeMetierServiceProvider,
    HomeMetierService,
    HomeRest,
    AuthenticationApplicatifServiceProvider,
    AuthenticationApplicatifService,
    AuthenticationMetierServiceProvider,
    AuthenticationMetierService,
    AuthGuardApplicatif,
    RoleGuardApplicatif,
    AdminGuardApplicatif,
    SplashGuardApplicatifService,
    ConnectivityService,
    ConstantService,
    SharedService,
    SharedDataService,
    AppConfig,
    AutorisationService,
    XlsxService,
    UtilsService,
    StorageManagementSupport,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigServiceFactory ,
      // useFactory: (config: AppConfig) => () => config.load(),
      deps: [AppConfig], multi: true
    },
    AuthHttp,
    JwtHelper,
      {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, AppConfig]
    },
    APP_PROVIDERS]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  /*public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }*/

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
