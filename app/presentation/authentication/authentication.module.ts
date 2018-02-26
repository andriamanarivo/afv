import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDirectiveModule } from '../../presentation/shared/shared-directive/shared-directive.module';

import {
    MdInputModule, MdSelectModule, MdProgressBarModule, MdAutocompleteModule, MdCheckboxModule, MdTabsModule,
    MdDatepickerModule, MdNativeDateModule

    //, MD_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';

import { PasswordRenderMailComponent } from './password-render-mail/password-render-mail.component';
import { ForgotpasswordPresentationComponent } from './forgotpassword-presentation/forgotpassword-presentation.component';
import { AuthenticationComponent } from './authentication.component';
import { Http, RequestOptions } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';
import { ControlMessagesModule } from '../../presentation/shared/control-messages/control-messages.module';
import { AuthenticationRoutingModule } from '../../contrainte/config/authentication/authentication.routes';
import { CompleteInfoComponent } from './complete-info/complete-info.component';
import { ExpireTokenGuard } from '../../service/applicatif/authentication/expireToken-guard.service';
import { AdministrationApplicatifService } from 'app/service/applicatif/administration';

import { StorageManagementSupport } from '../../commun/storage.management';

import { LoaderModule } from '../../presentation/loader';


@NgModule({
    imports: [
        CommonModule,
        ReCaptchaModule,
        FormsModule,
        ReactiveFormsModule,
        MdInputModule,
        TranslateModule,
        ControlMessagesModule,
        AuthenticationRoutingModule,
        MdInputModule, MdSelectModule,
        LoaderModule,
        SharedDirectiveModule
    ],
    declarations: [
        PasswordRenderMailComponent,
        ForgotpasswordPresentationComponent,
        AuthenticationComponent,
        CompleteInfoComponent
    ],
    providers: [
        ExpireTokenGuard,
        AdministrationApplicatifService,
        StorageManagementSupport
    ]
})
export class AuthenticationModule { }
