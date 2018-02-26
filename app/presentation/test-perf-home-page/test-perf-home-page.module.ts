import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from "@angular/forms";

import { SharedPipeModule } from '../../presentation/shared/shared-pipe/shared-pipe.module';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate';
import { TestPerfHomePageComponent } from "./test-perf-home-page.component";



@NgModule({
    imports: [
        CommonModule, 
        FormsModule     
    ],
    declarations: [       
        TestPerfHomePageComponent
    ],
    exports: [
        TestPerfHomePageComponent
    ],
    providers: [
        
    ]
})
export class TestPerfModule { }
