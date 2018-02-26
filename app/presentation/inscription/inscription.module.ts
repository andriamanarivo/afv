import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/primeng';


import {
  MdInputModule,MdSelectModule,MdProgressBarModule, MdAutocompleteModule, MdCheckboxModule, MdTabsModule,
      MdDatepickerModule, MdNativeDateModule, DateAdapter, NativeDateAdapter,
      MD_DATE_FORMATS
  //, MD_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';

import { 
  Http, 
  //HttpModule , RequestOptions  
} from '@angular/http';

import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';


import { LoaderModule } from "../../presentation/loader";
import { InscriptionRoutingModule } from "../../contrainte/config/inscription/inscription.routes";
import { SplashScreenRoutingModule } from "../../contrainte/config/splashcreen/splashcreen.routes";
//
import { TwoColumnPipe } from '../../presentation/shared/shared-pipe/two-column.pipe';
/* import { SharedPipeModule } from '../../presentation/shared/shared-pipe/shared-pipe.module'; */
import { SharedDirectiveModule } from '../../presentation/shared/shared-directive/shared-directive.module';

import {
  InscriptionComponent,
  VousetesPresentationComponent,
  StatutPresentationComponent,
  OrientationPresentationComponent,
  SituationPresentationComponent,
  TendancePresentationComponent,
  PratiquePresentationComponent,
  RecherchePresentationComponent,
  RenderMailComponent,
  ComptePresentationComponent,
  InscriptionConfirmPresentationComponent,
  InscriptionResolve
} from '.';

/* import { ControlMessagesComponent } from '../../presentation/shared/control-messages/control-messages.component'; */
import { ControlMessagesModule } from '../../presentation/shared/control-messages/control-messages.module';
import { UtilityFactory } from '../../contrainte/factory/_app/utility.factory';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdInputModule,
    MdSelectModule,
    MdAutocompleteModule,
    MdCheckboxModule, 
    LoaderModule,
    InscriptionRoutingModule,
    SplashScreenRoutingModule,
    TranslateModule,   
    ControlMessagesModule,
    SharedDirectiveModule,
    GrowlModule
  ],
  declarations: [
    InscriptionComponent, 
    VousetesPresentationComponent, 
    StatutPresentationComponent, 
    OrientationPresentationComponent, 
    SituationPresentationComponent, 
    TendancePresentationComponent, 
    PratiquePresentationComponent, 
    RecherchePresentationComponent, 
    ComptePresentationComponent, 
    InscriptionConfirmPresentationComponent, 
    RenderMailComponent,
    TwoColumnPipe/* ,
    ControlMessagesComponent */
  ],
  providers: [
    InscriptionResolve,
    UtilityFactory
  ]/* ,
  exports: [ControlMessagesComponent] */
})
export class InscriptionModule { }
