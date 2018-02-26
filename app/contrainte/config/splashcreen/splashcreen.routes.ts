import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashcreenComponent } from '../../../presentation/splashcreen/splashcreen.component';
import { ExpireTokenGuard } from '../../../service/applicatif/authentication/expireToken-guard.service';
import { ContactUsComponent } from 'app/presentation/splashcreen/contact-us/contact-us.component';
import { MentionLegaleComponent } from 'app/presentation/splashcreen/mention-legale/mention-legale.component';
import { CguComponent } from 'app/presentation/splashcreen/cgv/cgv.component';
import { PersonalDataComponent } from 'app/presentation/splashcreen/personal-data/personal-data.component';

import { AboutComponent } from 'app/presentation/splashcreen/about/about.component';
import { ConfidentialityComponent } from 'app/presentation/splashcreen/confidentiality/confidentiality.component';
import { HelpComponent } from 'app/presentation/splashcreen/help/help.component';

const routes: Routes = [
    { path: 'splashcreen', component: SplashcreenComponent, canActivate: [ExpireTokenGuard] },
    { path: 'contactUs', component: ContactUsComponent, canActivate: [ExpireTokenGuard] },
    { path: 'mentionLegale', component: MentionLegaleComponent, canActivate: [ExpireTokenGuard] },
    { path: 'personalData', component: PersonalDataComponent, canActivate: [ExpireTokenGuard] },
    { path: 'cgu', component: CguComponent, canActivate: [ExpireTokenGuard] },
    { path: 'cgu/:fromSetting', component: CguComponent, canActivate: [ExpireTokenGuard] },
    { path: 'about', component: AboutComponent, canActivate: [ExpireTokenGuard] },
    { path: 'confidentiality', component: ConfidentialityComponent, canActivate: [ExpireTokenGuard] },
    { path: 'help', component: HelpComponent, canActivate: [ExpireTokenGuard] },
    { path: 'help/:fromSetting', component: HelpComponent, canActivate: [ExpireTokenGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SplashScreenRoutingModule { }
