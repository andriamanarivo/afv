import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TwoColumnPipe } from './two-column.pipe';
import { TruncatePipe } from './truncate.pipe';
/* import { OrderBy } from './orderBy.pipe'; */
import { OrderByTimeStamp } from './orderByTimeStamp.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    //TwoColumnPipe
    TruncatePipe,
    OrderByTimeStamp
  ],
  exports:[
    TruncatePipe,
    OrderByTimeStamp
  ]
})
export class SharedPipeModule { }
