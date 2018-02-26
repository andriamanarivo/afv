import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { MdProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdProgressSpinnerModule
  ],
  declarations: [LoaderComponent],
  exports : [LoaderComponent]
})
export class LoaderModule { }
