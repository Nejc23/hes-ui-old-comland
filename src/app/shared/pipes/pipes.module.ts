import { FormatDatePipe } from './pipes/format-date.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateDefaultPipe } from './pipes/date-default.pipe';
import { FormatDateTimePipe } from './pipes/format-date-time.pipe';

@NgModule({
  exports: [DateDefaultPipe, FormatDatePipe, FormatDateTimePipe],
  declarations: [DateDefaultPipe, FormatDatePipe, FormatDateTimePipe],
  imports: [CommonModule]
})
export class PipesModule {}
