import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SharedPipeModule } from '../../presentation/shared/shared-pipe/shared-pipe.module';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdSidenavModule, MaterialModule } from '@angular/material';
import { ContactMessageComponent } from './contact-message/contact-message.component';
import { SettingComponent } from './setting/setting.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { ConfirmMessageComponent } from '../../presentation/home-presentation/tchat/confirm.message.component';
import { ModalReportabusComponent } from '../../presentation/home-presentation/tchat/modal/modal-reportabus.component';
import { MdDialogModule, MdButtonModule, MdSelectModule, MdProgressSpinnerModule } from '@angular/material';
import { TchatComponent } from './tchat/tchat.component';
import { GestionNotificationComponent } from './gestion-notification/gestion-notification.component';
import { ContactSearchPipe } from './tchat/contact-search.pipe';
import { GrowlModule } from 'primeng/primeng';
import {ModalConfirmComponent} from './modal-confirm/modal-confirm.component';
import { UserCardComponent } from './user-card/user-card.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { LightboxModule } from 'angular2-lightbox';

import { SidebarModule } from 'primeng/primeng';
import { LoaderModule } from '../../presentation/loader';
import { Ng2Webstorage,SessionStorageService } from 'ngx-webstorage';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlbumComponent } from './album/album.component';
import { PhotoProfilModalComponent } from '../../presentation/home-presentation/photo-profil-modal/photo-profil-modal.component';
import { AdministrationApplicatifService } from 'app/service/applicatif/administration';



@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MdSidenavModule,
        FormsModule,
        MdDialogModule,
        MdButtonModule,
        MdSelectModule,
        MdProgressSpinnerModule,
        TranslateModule,
        LoaderModule,
        Ng2Webstorage,
        SharedPipeModule,
        GrowlModule,
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        MalihuScrollbarModule.forRoot(),
        LightboxModule,
        SidebarModule
    ],
    entryComponents: [
        ConfirmMessageComponent,
        ModalReportabusComponent,
        ModalConfirmComponent,
        PhotoProfilModalComponent
    ],
    declarations: [
        SettingComponent,
        BlacklistComponent,
        TchatComponent,
        ContactSearchPipe,
        ConfirmMessageComponent,
        ModalReportabusComponent,
        ModalConfirmComponent,
        UserCardComponent,
        GestionNotificationComponent,
        AlbumComponent,
        PhotoProfilModalComponent
        ],
    exports: [
        SettingComponent,
         TchatComponent,
         ContactSearchPipe,
         UserCardComponent,
         AlbumComponent
        ],
    providers: [
        BsModalRef,
        AdministrationApplicatifService
    ]
})
export class HomePresentationModule { }
