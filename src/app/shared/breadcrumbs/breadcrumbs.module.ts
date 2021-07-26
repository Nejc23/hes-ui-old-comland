import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [BreadcrumbComponent],
  declarations: [BreadcrumbComponent],
  imports: [CommonModule, RouterModule, TranslateModule]
})
export class BreadcrumbsModule {}
