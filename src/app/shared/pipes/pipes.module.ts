import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateDefaultPipe } from './pipes/date-default.pipe';

@NgModule({
  exports: [DateDefaultPipe],
  declarations: [DateDefaultPipe],
  imports: [CommonModule]
})
export class PipesModule {}
