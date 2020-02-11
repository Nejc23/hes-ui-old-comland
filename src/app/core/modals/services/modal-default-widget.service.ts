import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DashboardStoreService } from 'src/app/features/dashboard/services/dashboard-store.service';
import { DashboardGridItem } from 'src/app/features/dashboard/interfaces/dashboard-grid-item.interface';
import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ModaDefaultWidgetService {
  constructor(private dashboardStore: DashboardStoreService) {}

  setDashboardSettings(form: FormGroup, widgetId: string) {
    const widget = this.dashboardStore.getGridDashboard().find(x => x.id === widgetId);

    if (widget && (widget.properties === undefined || widget.properties == null)) {
      widget.properties = {
        powerline: null,
        device: null
      };
    }

    if (widget && widget.properties) {
      if (form.get('powerlineId')) {
        widget.properties.powerline = Number(form.get('powerlineId').value);
      }
      if (form.get('deviceId')) {
        widget.properties.device = Number(form.get('deviceId').value);
      }
      this.setDefaultWidgets(form, widget);
    }
  }

  /**
   * set setting s for ampacity widget
   * @param form current form of settings popup-window
   * @param widget current dashboard item / ampacity widget item
   */
  setAmpacityWidget(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 1;
    widget.rows = 1;
    let rows = 1;
    let cols = 1;
    widget.properties.displayGraph = null;
    widget.properties.displayPrediction = null;
    widget.properties.displayHistory = null;

    if (form.get('displayGraph') !== undefined) {
      widget.properties.displayGraph = form.get('displayGraph').value;
      widget.properties.displayPrediction = form.get('displayPrediction').value;
      widget.properties.displayHistory = form.get('displayHistory').value;
      if (widget.properties.displayGraph) {
        cols = 3;
        rows = 2;
      }
      this.setWidgetSize(widget, rows, cols);
    }
  }

  /**
   * set setting s for icing widget
   * @param form current form of settings popup-window
   * @param widget current dashboard item / icing widget item
   */
  setIcingWidget(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 1;
    widget.rows = 1;
    let rows = 1;
    let cols = 1;
    widget.properties.displaySuggestedDeicingCurrent = null;

    if (form.get('displaySuggestedDeicingCurrent') !== undefined) {
      widget.properties.displaySuggestedDeicingCurrent = form.get('displaySuggestedDeicingCurrent').value;
      if (widget.properties.displaySuggestedDeicingCurrent) {
        cols = 2;
        rows = 1;
      }
      this.setWidgetSize(widget, rows, cols);
    }
  }

  /**
   * set setting s for map widget
   * @param form current form of settings popup-window
   * @param widget current dashboard item / map widget item
   */
  setMapWidget(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 1;
    widget.rows = 1;
    widget.properties.mapSizeId = null;
    let rows = 1;
    let cols = 1;
    if (form.get('mapSizeId') !== undefined) {
      widget.properties.mapSizeId = form.get('mapSizeId').value;
      switch (Number(widget.properties.mapSizeId)) {
        case 1: {
          cols = 3;
          rows = 2;
          break;
        }
        case 2: {
          cols = 3;
          rows = 3;
          break;
        }
        case 3: {
          cols = 4;
          rows = 3;
          break;
        }
        case 4: {
          cols = 6;
          rows = 3;
          break;
        }
        case 5: {
          cols = 6;
          rows = 4;
          break;
        }
        case 6: {
          cols = 6;
          rows = 6;
          break;
        }
      }
      this.setWidgetSize(widget, rows, cols);
    }
  }

  /**
   * set setting s for picture widget
   * @param form current form of settings popup-window
   * @param widget current dashboard item / picture widget item
   */
  setPictureWidget(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 1;
    widget.rows = 1;
    widget.properties.pictureSizeId = null;
    let rows = 1;
    let cols = 1;
    if (form.get('pictureSizeId') !== undefined) {
      widget.properties.pictureSizeId = form.get('pictureSizeId').value;

      if (Number(form.get('pictureSizeId').value) === 1) {
        cols = 1;
        rows = 1;
      } else if (Number(form.get('pictureSizeId').value) === 2) {
        cols = 2;
        rows = 2;
      }
      this.setWidgetSize(widget, rows, cols);
    }

    if (form.get('livePhoto') !== undefined) {
      if (Number(form.get('livePhoto').value) === 1) {
        widget.properties.livePhoto = true;
      } else {
        widget.properties.livePhoto = false;
      }
    }
  }

  /**
   * set setting for status widgets
   * @param form current form of settings popup-window
   * @param widget current dashboard item / status widget item
   */
  setStatusWidgets(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 2;
    widget.rows = 2;
  }

  /**
   * set default setting for widgets
   * @param form current form of settings popup-window
   * @param widget current dashboard item
   */
  setDefaultWidgets(form: FormGroup, widget: DashboardGridItem) {
    widget.cols = 1;
    widget.rows = 1;
    let rows = 1;
    let cols = 1;
    widget.properties.displayGraph = null;

    if (form.get('displayHistoryGraph') !== undefined) {
      widget.properties.displayGraph = form.get('displayHistoryGraph').value;
      cols = 2;
      rows = 2;
      this.setWidgetSize(widget, rows, cols);
    }
  }

  /**
   * for refreshing widget size on grid
   * @param widget current widget
   * @param rows current rows size
   * @param cols current cols size
   */
  private setWidgetSize(widget: DashboardGridItem, rows: number, cols: number) {
    const grid = this.dashboardStore.getGridState();

    const newWidget: DashboardGridItem = {
      id: widget.id,
      widgetType: widget.widgetType,
      content: widget.content,
      properties: widget.properties,
      readings: widget.readings,
      x: widget.x,
      y: widget.y,
      rows,
      cols
    };

    grid.dashboard.splice(grid.dashboard.indexOf(widget), 1);
    this.dashboardStore.addGridItem(newWidget);
  }
}
