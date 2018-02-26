import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TranslateModule } from 'ng2-translate';
import { MdDialogModule, MdButtonModule, MdSelectModule, MdProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MentionLegaleComponent } from './mention-legale/mention-legale.component';
import { CguComponent } from './cgv/cgv.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { GrowlModule } from 'primeng/primeng';

import { AboutComponent } from './about/about.component';
import { ConfidentialityComponent } from './confidentiality/confidentiality.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    GrowlModule
  ],
  declarations: [
    ContactUsComponent,
    MentionLegaleComponent,
    CguComponent,
    PersonalDataComponent,
    AboutComponent,
    ConfidentialityComponent,
    HelpComponent
   ],
  exports: [ ContactUsComponent ],
  providers: []
})
export class SplashcreenModule { }
