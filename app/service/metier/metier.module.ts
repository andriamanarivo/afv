import { NgModule } from '@angular/core';
import { UtilisateurMetierServiceProvider,UtilisateurMetierServiceMockProvider } from "./utilisateur";
import { AdministrationMetierServiceProvider,AdministrationMetierServiceMockProvider } from "./administration";
import { SiteMetierServiceProvider, SiteMetierServiceMockProvider } from "./site";
import { SplashscreenMetierServiceProvider } from 'app/service/metier/splashscreen/splashscreen.metier.provider';
@NgModule({
    providers: [
        UtilisateurMetierServiceProvider,
        AdministrationMetierServiceProvider,
        SiteMetierServiceProvider,
        SplashscreenMetierServiceProvider
    ]
})
export class MetierModule { }
