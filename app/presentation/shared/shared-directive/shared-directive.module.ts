import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './number-only.directive';
import { CustomMonthDirective } from './custom-month.directive';
import { CustomDayDirective } from './custom-day.directive';
import { CustomYearDirective } from './custom-year.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NumberOnlyDirective,
    CustomMonthDirective,
    CustomDayDirective,
    CustomYearDirective
  ],
  exports: [
    NumberOnlyDirective,
    CustomMonthDirective,
    CustomDayDirective,
    CustomYearDirective
  ]
})
export class SharedDirectiveModule { }
