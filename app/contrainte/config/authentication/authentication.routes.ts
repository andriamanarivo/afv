
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AuthenticationComponent,
  ForgotpasswordPresentationComponent,
  PasswordRenderMailComponent

} from '../../../presentation/authentication';
import { CompleteInfoComponent } from '../../../presentation/authentication/complete-info/complete-info.component';
import { ExpireTokenGuard } from '../../../service/applicatif/authentication/expireToken-guard.service';


const loginRoute = {path : 'login', component : AuthenticationComponent, canActivate: [ExpireTokenGuard]};
const logoutRoute = {
        path: 'logout',
        name: 'logout',
        component: AuthenticationComponent
};


const forgotpasswordRoute = {
        path: 'login/forgotpassword',
        component: ForgotpasswordPresentationComponent
};
/*const CompleteInfoRoute = {
    path: 'completeInfo',
    name: 'completeInfo',
    component: CompleteInfoComponent

};*/
const passwordRenderMailRoute = {
        path: 'password/renderMail/:idSite/:slug/:pseudo/:mail/:dateSendMail',
        component: PasswordRenderMailComponent
};

const routes: Routes = [
        loginRoute, forgotpasswordRoute,passwordRenderMailRoute, logoutRoute
];



@NgModule({
        imports: [ RouterModule.forChild(routes) ],
        exports: [ RouterModule ]
      })
export class AuthenticationRoutingModule { }

/* export const AUTHENTICATION_ROUTES = RouterModule.forChild(ROUTES); */
