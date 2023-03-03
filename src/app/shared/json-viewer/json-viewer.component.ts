import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent {
  @Input() objectToRender: any;
  @Input() expanded = true;
  @Input() depth = 0;
  @Input() cssClass = '';
  constructor() {}
}
