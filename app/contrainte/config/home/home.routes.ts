import { Routes, RouterModule } from '@angular/router';


import {
  HomePresentationComponent,
  MainUsersComponent,
  ProfilComponent,
  ModifProfilComponent,
  FavorisComponent,
  visiteurComponent,
  ContactMessageComponent,
  ListeComponent,
  SouscriptionComponent,
  SouscriptionDetailComponent,
  rechercheComponent,
  SettingComponent,
  BlacklistComponent,
  GestionNotificationComponent
} from '../../../presentation/home-presentation';

import { SplashGuardApplicatifService } from '../../../service/applicatif/authentication/splash-guard-applicatif.service';
import { AuthGuardApplicatif } from '../../../service/applicatif/authentication/auth-guard.applicatif.service';
import { CompleteInfoComponent } from '../../../presentation/authentication/complete-info/complete-info.component';

const homeRoute = {

  path : 'home',

  component : HomePresentationComponent,

  children: [

      {
        path: 'user',
        component: rechercheComponent,
          canActivate: [AuthGuardApplicatif]
      },
      {
        path: 'profil/:id',
        component: ProfilComponent,
        name: 'profilId',
        canActivate: [AuthGuardApplicatif]
      },
        {
        path: 'profil/:id/:to',
        component: ProfilComponent,
        name: 'profilTo',
        canActivate: [AuthGuardApplicatif]
      },
      {
        path: 'modifProfil/:showSetting',
        component: ModifProfilComponent,
          canActivate: [AuthGuardApplicatif]
      }
       ,
      {
        path: 'favoris',
        component: FavorisComponent,
          canActivate: [AuthGuardApplicatif]
      },
      {
          path: 'visiteur',
          component: visiteurComponent,
          canActivate: [AuthGuardApplicatif]
      }
      ,
      {
        path: 'messages',
        component: ContactMessageComponent,
          canActivate: [AuthGuardApplicatif]
      }
      ,
      {
        path: 'liste',
        component: ListeComponent,
        canActivate: [AuthGuardApplicatif]

      },
      {
        path: 'souscription',
        component: SouscriptionComponent,
        canActivate: [AuthGuardApplicatif]

      },
      {
        path: 'souscription/:id/detail',
        component: SouscriptionDetailComponent,
        canActivate: [AuthGuardApplicatif]
      },
      {
          path: 'setting',
          component : SettingComponent,
          canActivate: [AuthGuardApplicatif]
      },
      {
          path: 'blacklist',
          component: BlacklistComponent,
          canActivate: [AuthGuardApplicatif]
      },
       {
           path: 'notification',
           component: GestionNotificationComponent,
           canActivate: [AuthGuardApplicatif]
      },
      {
          path: 'completeInfo',
          name: 'completeInfo',
          component: CompleteInfoComponent,
          canActivate: [AuthGuardApplicatif]
      }

  ]
      };

const ROUTES: Routes = [
    homeRoute
];


export const HOME_ROUTES = RouterModule.forChild(ROUTES);
