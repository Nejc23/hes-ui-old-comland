import { FormatDatePipe } from './pipes/format-date.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateDefaultPipe } from './pipes/date-default.pipe';
import { FormatDateTimePipe } from './pipes/format-date-time.pipe';
import { FormatDateOnlyPipe } from './pipes/format-date-only.pipe';

@NgModule({
  exports: [DateDefaultPipe, FormatDatePipe, FormatDateTimePipe, FormatDateOnlyPipe],
  declarations: [DateDefaultPipe, FormatDatePipe, FormatDateTimePipe, FormatDateOnlyPipe],
  imports: [CommonModule]
})
export class PipesModule {}
