import { Component, AfterViewInit, Input, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { DashboardGridItem } from '../../interfaces/dashboard-grid-item.interface';
import { DashboardGridService } from '../../services/dashboard-grid.service';
import { WidgetGridItemDirective } from 'src/app/features/widgets/directives/widget-grid-item.directive';
import { GridWidgetAccess } from 'src/app/features/widgets/interfaces/grid-widget-access.interface';

@Component({
  selector: 'app-grid-item-content',
  templateUrl: './grid-item-content.component.html'
})
export class GridItemContentComponent implements OnInit {
  @Input() item: DashboardGridItem;

  @ViewChild(WidgetGridItemDirective, { static: true }) contentHost: WidgetGridItemDirective;

  constructor(private gridService: DashboardGridService, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.initializeWidgetContent();
  }

  initializeWidgetContent() {
    const component = this.gridService.getGridWidgetComponent(this.item.widgetType);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = this.contentHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as GridWidgetAccess).content = this.item.content;
    (componentRef.instance as GridWidgetAccess).readings = this.item.readings;
    (componentRef.instance as GridWidgetAccess).id = this.item.id;
  }
}
