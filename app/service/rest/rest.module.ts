import { NgModule } from '@angular/core';
import { UtilisateurRest } from "./utilisateur/utilisateur.rest";
import { AdministrationRest } from "./administration/administration.rest";

import { SiteRest } from "./site/site.rest";
import { SplashscreenRestService } from 'app/service/rest/splashscreen/splashscreen.rest.service';

@NgModule({
    providers: [
        UtilisateurRest,
        AdministrationRest,
        SiteRest,
        SplashscreenRestService
    ]
})
export class RestModule { }
