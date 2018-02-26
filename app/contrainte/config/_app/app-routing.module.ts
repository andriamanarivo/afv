import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

/* import { INSCRPTION_ROUTES }      from '../inscription/inscription.routes'; */
/* import { SPLASH_SCREEN }      from '../splashcreen/splashcreen.routes'; */
import { HOME_ROUTES } from '../home/home.routes';
import { TESTPERF_ROUTES } from '../testPerf/tesPerfRoutes';
/* import { AUTHENTICATION_ROUTES }      from '../authentication/authentication.routes'; */

import {
        SplashcreenComponent
} from '../../../presentation/splashcreen/splashcreen.component';


import { AuthGuardApplicatif } from '../../../service/applicatif/authentication/auth-guard.applicatif.service';
import { SplashGuardApplicatifService } from '../../../service/applicatif/authentication/splash-guard-applicatif.service';



const emptyLinkRedirect = {
        path: '',
        redirectTo: '/home/user',
        pathMatch: 'full'/*,
        canActivate: [SplashGuardApplicatifService]*/
};

const routes = [
emptyLinkRedirect];

@NgModule({
        imports: [
        RouterModule.forRoot(routes),
        HOME_ROUTES,
        TESTPERF_ROUTES
        // INSCRPTION_ROUTES,
        /* AUTHENTICATION_ROUTES, */
        /* SPLASH_SCREEN */
        ],
        exports: [RouterModule]

})
export class AppRoutingModule { }
