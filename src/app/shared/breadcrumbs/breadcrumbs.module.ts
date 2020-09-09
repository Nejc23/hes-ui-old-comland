import { BreadcrumbService } from './services/breadcrumb.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { RouterModule } from '@angular/router';

@NgModule({
  exports: [BreadcrumbComponent],
  declarations: [BreadcrumbComponent],
  imports: [CommonModule, RouterModule]
})
export class BreadcrumbsModule {}
