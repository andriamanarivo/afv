import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//angular material
import {
  MdSidenavModule , 
  MaterialModule,
  MdInputModule,
  MdSelectModule,
  MdProgressBarModule, 
  MdAutocompleteModule, 
  MdCheckboxModule, 
  MdTabsModule,
  MdDatepickerModule,
  MdNativeDateModule, 
  DateAdapter, 
  NativeDateAdapter,
  MD_DATE_FORMATS
} from '@angular/material';

import { UsersComponent } from './users.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { GrowlModule } from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    //Angular material
    MdInputModule,
    MdSelectModule,
    MdProgressBarModule,
    MdTabsModule, 
    MdCheckboxModule, 
    MdAutocompleteModule,
    GrowlModule
  ],
  declarations: [UsersComponent, UserProfilComponent],
  exports: [UserProfilComponent]
})
export class UsersModule { }
