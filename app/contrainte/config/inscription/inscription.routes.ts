import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  InscriptionComponent,
  VousetesPresentationComponent,
  StatutPresentationComponent,
  OrientationPresentationComponent,
  SituationPresentationComponent,
  TendancePresentationComponent,
  PratiquePresentationComponent,
  RecherchePresentationComponent,
  // CaracteristiquePresentationComponent,
  // CaracteristiqueautrePresentationComponent,
  RenderMailComponent,
  ComptePresentationComponent,
  InscriptionConfirmPresentationComponent,
  InscriptionResolve
} from '../../../presentation/inscription';

/*
const emptyLinkRedirect = {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
};
*/

// const inscriptionRoute = {path : "inscription", component : InscriptionComponent};
const inscriptionRoute = {
  path : 'inscription', component : InscriptionComponent,
  resolve: {
    inscriptiondata : InscriptionResolve
  },
  children: [
      // { path: '', redirectTo: '/Vousetes', pathMatch: 'full', terminal: true },
      {
        path: 'Vousetes',
        component: VousetesPresentationComponent
      },
      {
        path : 'statut',
        component : StatutPresentationComponent
      },
      {
        path : 'orientation',
        component : OrientationPresentationComponent
      },
      {
        path : 'situation',
        component : SituationPresentationComponent
      },
      {
        path : 'tendance',
        component : TendancePresentationComponent
      },
      {
        path : 'pratique',
        component : PratiquePresentationComponent
      },
      {
        path : 'recherche',
        component : RecherchePresentationComponent
      },
      {
        // path : "renderMailConfirm",
        path: 'renderMailConfirm/:slug/:pseudo/:mail/:dateSendMail',
        component : RenderMailComponent
      },
      {
        path : 'compte',
        component : ComptePresentationComponent
      },
      {
        path : 'inscriptionConfirm',
        component : InscriptionConfirmPresentationComponent
      }
  ]
};


const routes: Routes = [
    inscriptionRoute
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class InscriptionRoutingModule { }

/* export const INSCRPTION_ROUTES = RouterModule.forChild(routes); */
