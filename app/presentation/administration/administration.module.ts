import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { GrowlModule } from 'primeng/primeng';
import { EditorModule, SpinnerModule, ButtonModule, SharedModule } from 'primeng/primeng';
import { ColorPickerModule } from 'ngx-color-picker';


import { AdministrationComponent } from './administration.component';
import { UtilisateurListComponent } from './utilisateur-list/utilisateur-list.component';
import { UtilisateurDetailComponent } from './utilisateur-detail/utilisateur-detail.component';

import { AdministrationRoutingModule } from '../../contrainte/config/administration/administration.routes';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { SiteListComponent } from './site-list/site-list.component';
import { thematiqueListComponent } from './thematique-list/thematique-list.component';
import { couleurListComponent } from './couleur-list/couleur-list.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatepickerModule } from 'angular2-material-datepicker';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { TranslateModule } from 'ng2-translate';
// import { UserProfilComponent } from '../../presentation/users'

import { LoaderModule } from '../../presentation/loader';

import { UsersModule } from '../../presentation/users/users.module';
import { SwitchCheckboxComponent } from './switch-checkbox/switch-checkbox.component';
import { CustomColorPickerComponent } from './custom-color-picker/custom-color-picker.component';
import { SharedPipeModule } from '../../presentation/shared/shared-pipe/shared-pipe.module';
import { HomePresentationModule } from '../home-presentation/home-presentation.module';
import { MdRadioModule } from '@angular/material';

import {
    MdInputModule, MdSelectModule, MdProgressBarModule, MdAutocompleteModule, MdCheckboxModule, MdTabsModule,
    MdDatepickerModule, MdNativeDateModule, DateAdapter, NativeDateAdapter,
    MD_DATE_FORMATS, MdGridListModule, MdButtonModule
    //, MD_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ListAbusComponent } from './list-abus/list-abus.component';
import { AbusDetailComponent } from './abus-detail/abus-detail.component';
import { ListAbonnementComponent } from './list-abonnement/list-abonnement.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { TchatModalComponent } from './tchat-modal/tchat-modal.component';
import { ListTermesInterditComponent } from './list-termes-interdit/list-termes-interdit.component';
import { GestionOffreComponent } from './gestion-offre/gestion-offre.component';

import { ControlMessagesModule } from '../../presentation/shared/control-messages/control-messages.module';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { ModerationPhotoComponent } from './moderation-photo/moderation-photo.component';
import { ModerationTextComponent } from './moderation-text/moderation-text.component';
import { ImportComponent } from './import/import.component';
import { ResizePhotoComponent } from './resize-photo/resize-photo.component';
import { EditImgComponent } from './edit-img/edit-img.component';
import { GestionCodesComponent } from './gestion-codes/gestion-codes.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        Ng2TableModule,
        AdministrationRoutingModule,
        ColorPickerModule,
        UsersModule,
        AlertModule.forRoot(),
        Ng2SmartTableModule,
        SharedPipeModule,
        MdInputModule,
        MdSelectModule,
        MdGridListModule,
        MdButtonModule,
        LoaderModule,
        DatepickerModule,
        TranslateModule,
        HomePresentationModule,
        MultiselectDropdownModule,
        GrowlModule,
        EditorModule,
        ButtonModule,
        SharedModule,
        SpinnerModule,
        ControlMessagesModule,
        MdRadioModule
    ],
    declarations: [
        AdministrationComponent,
        UtilisateurListComponent,
        UtilisateurDetailComponent,
        SiteListComponent,
        SiteDetailComponent,
        thematiqueListComponent,
        AdminHeaderComponent,
        AdminNavigationComponent,
        couleurListComponent, SwitchCheckboxComponent, CustomColorPickerComponent,
        ConfirmDialogComponent, ListAbusComponent, AbusDetailComponent, ListAbonnementComponent,
        MessageDialogComponent, TchatModalComponent, ListTermesInterditComponent, GestionOffreComponent, NewsletterComponent, ModerationPhotoComponent, ModerationTextComponent, ImportComponent, ResizePhotoComponent, EditImgComponent, GestionCodesComponent
    ],
    entryComponents: [
        SwitchCheckboxComponent, CustomColorPickerComponent, ConfirmDialogComponent, MessageDialogComponent, TchatModalComponent
    ],
    providers: [
        BsModalRef
    ]
})
export class AdministrationModule { }
