import { DataProcessingService } from 'src/app/core/repository/services/data-processing/data-processing.service';
import { Component, Input } from '@angular/core';
import { environment } from './../../../../../../environments/environment';
import { IntlService } from '@progress/kendo-angular-intl';
import { RegisterValue } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { LegendItemVisualArgs, LegendLabelsContentArgs, LegendTitle } from '@progress/kendo-angular-charts';
import { Path, Text, Group, geometry, Element, Rect as RectShape } from '@progress/kendo-drawing';
import { EventsById } from '../../interfaces/events-processing.interface';
const { Point, Rect, Size } = geometry;

@Component({
  templateUrl: 'registers-pie-chart.component.html',
  selector: 'app-registers-pie-chart'
})
export class RegistersPieChartComponent {
  public eventValues: RegisterValue[];
  @Input() public eventsById: EventsById[];

  public dateFormats;

  public legendTitle: LegendTitle = {
    text: 'Total',
    align: 'right'
  };

  constructor(private dataProcessingService: DataProcessingService, private intl: IntlService) {
    this.dateFormats = environment.kendoChartCategoryDateFormats;

    this.labelContent = this.labelContent.bind(this);
  }

  public labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.count}`;
  }

  public labelsVisual(args: LegendItemVisualArgs): any {
    // Create rectangular shape on top of which the label will be drawn
    const rectOptions = { stroke: { width: 2, color: '#fff' }, fill: { color: '#fff' } };
    const rectGeometry = new Rect(new Point(0, 3), new Size(60, 24));
    const rect: RectShape = new RectShape(rectGeometry, rectOptions);

    // Create the lines used to represent the custom legend item
    const pathColor = args.options.markers.border.color;
    const path1 = new Path({
      stroke: {
        color: pathColor,
        width: 20
      }
    });

    // The paths are constructed by using a chain of commands
    path1
      .moveTo(0, 9)
      .lineTo(20, 9)
      .close();
    // path2.moveTo(15, 7).lineTo(25, 7).close();

    // Create the text associated with the legend item
    const labelFont = args.options.labels.font;
    const fontColor = args.options.labels.color;
    const textOptions = { font: labelFont, fill: { color: fontColor } };
    const text = new Text(args.series.data[args.pointIndex].category, new Point(28, 0), textOptions);

    // Place all the shapes in a group
    const group = new Group();

    group.append(rect, path1, text);

    // set opacity if the legend item is disabled
    if (!args.active) {
      group.opacity(0.5);
    }

    return group;
  }
}
