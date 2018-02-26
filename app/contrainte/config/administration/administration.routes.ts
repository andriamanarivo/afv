import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//
import { AdminGuardApplicatif } from '../../../service/applicatif/authentication/admin-guard.applicatif.service';
import { RoleGuardApplicatif } from '../../../service/applicatif/authentication/role-guard.applicatif.service';
import { AuthGuardApplicatif } from '../../../service/applicatif/authentication/auth-guard.applicatif.service';
import { ListAbonnementComponent} from '../../../presentation/administration/list-abonnement/list-abonnement.component';
import { ListTermesInterditComponent} from '../../../presentation/administration/list-termes-interdit/list-termes-interdit.component';
import {GestionOffreComponent} from '../../../presentation/administration/gestion-offre/gestion-offre.component';
import {GestionCodesComponent} from '../../../presentation/administration/gestion-codes/gestion-codes.component';
import { NewsletterComponent } from '../../../presentation/administration/newsletter/newsletter.component';

import {
    AdministrationComponent,
    UtilisateurListComponent,
    UtilisateurDetailComponent,
    SiteListComponent,
    SiteDetailComponent,
    thematiqueListComponent,
    couleurListComponent,
    ListAbusComponent,
    AbusDetailComponent
} from '../../../presentation/administration';
import { ModerationPhotoComponent } from 'app/presentation/administration/moderation-photo/moderation-photo.component';
import { ModerationTextComponent } from 'app/presentation/administration/moderation-text/moderation-text.component';
import { ImportComponent } from 'app/presentation/administration/import/import.component';
import { ResizePhotoComponent } from 'app/presentation/administration/resize-photo/resize-photo.component';
import { EditImgComponent } from 'app/presentation/administration/edit-img/edit-img.component';

const administrationRoute = {
    path: 'administration', component: AdministrationComponent,
    children: [
        {
            path: 'utilisateurs',
            component: UtilisateurListComponent
            , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'utilisateurs/:etat',
            component: UtilisateurListComponent,
            name: 'utilisateursParams'
            , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'utilisateur/:id',
            component: UtilisateurDetailComponent
            , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'sites',
            component: SiteListComponent
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'sites/:etat',
            component: SiteListComponent,
            name: 'sitesParams'
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'site/:id',
            component: SiteDetailComponent
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'listeThematique',
            component: thematiqueListComponent
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'listeCouleur',
            component: couleurListComponent
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'abus',
            component: ListAbusComponent
            , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'abonnement',
            component: ListAbonnementComponent
             , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'abus-detail/:id',
            component: AbusDetailComponent
             , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'resize-photo',
            component: ResizePhotoComponent
             , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'edit-photo',
            component: EditImgComponent
             , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'termes-interdit',
            component: ListTermesInterditComponent
             , canActivate: [RoleGuardApplicatif]
        },
        {
            path: 'gestion-offre',
            component: GestionOffreComponent
             , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'gestion-codes',
            component: GestionCodesComponent
            , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'moderation-photo',
            component: ModerationPhotoComponent
             , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'moderation-text',
            component: ModerationTextComponent
             , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'import',
            component: ImportComponent
             , canActivate: [AdminGuardApplicatif]
        },
        {
            path: 'newsletter',
            component: NewsletterComponent
             , canActivate: [AdminGuardApplicatif]
        }
    ]
};

const routes: Routes = [
    administrationRoute
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdministrationRoutingModule { }
