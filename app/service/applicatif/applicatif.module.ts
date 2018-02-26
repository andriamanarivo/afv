import { NgModule } from '@angular/core';

import { UtilisateurApplicatifServiceProvider,UtilisateurApplicatifServiceMockProvider } from "./utilisateur";
import { AdministrationApplicatifServiceProvider,AdministrationApplicatifServiceMockProvider } from "./administration";
import { UtilisateurFactory } from "../../contrainte/factory/utilisateur/utilisateur-factory.service";
import { SiteApplicatifServiceProvider,SiteApplicatifServiceMockProvider } from "./site";
import { SiteFactory } from "../../contrainte/factory/site/site-factory.service";

import { InscriptionFactory } from "../../contrainte/factory/inscription/inscription-factory.service";
import { SplashscreenApplicatifServiceProvider } from 'app/service/applicatif/splashscreen/splashscreen.applicatif.provider';

@NgModule({
    providers: [        
        UtilisateurApplicatifServiceProvider,
        UtilisateurFactory,
        AdministrationApplicatifServiceProvider,
        SiteApplicatifServiceProvider,
        SiteFactory,
        InscriptionFactory,
        SplashscreenApplicatifServiceProvider
    ]
})
export class ApplicatifModule { }
