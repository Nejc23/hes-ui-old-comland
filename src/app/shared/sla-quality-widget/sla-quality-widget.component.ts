import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SlaWidgetData } from '../data-table/data-table.component';
import { QualityTrendSlaDto } from '../../api/data-processing/models/quality-trend-sla-dto';
import { GetDataV2Service } from '../../api/data-processing/services/get-data-v-2.service';
import { Observable, Subscription } from 'rxjs';
import { JobsService } from '../../api/scheduler/services/jobs.service';
import { ConcentratorService } from '../../core/repository/services/concentrator/concentrator.service';

@Component({
  selector: 'app-sla-quality-widget',
  templateUrl: './sla-quality-widget.component.html',
  styleUrls: ['./sla-quality-widget.component.scss']
})
export class SlaQualityWidgetComponent implements OnInit, OnDestroy {
  @Output() closeButtonClickedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() title = '';
  @Input() deviceId = '';
  @Input() selectBy = '';

  nextReadDate = '';
  lastCommunicationDate = '';
  noData = false;

  slaWidgetData: SlaWidgetData;

  slaData$: Observable<QualityTrendSlaDto>;
  nextRead$: Observable<string>;
  lastComm$: Observable<string>;
  subscriptions: Array<Subscription> = [];

  constructor(
    private getDataV2Service: GetDataV2Service,
    private jobsService: JobsService,
    private concentratorService: ConcentratorService
  ) {}

  ngOnInit(): void {
    this.getSlaData();
  }

  close() {
    this.closeButtonClickedEvent.emit(true);
  }

  calculateBarHeight(item: number): number {
    return item * 0.01 * 33 ?? 0;
  }

  getSlaColor(value: number): string {
    if (value >= environment.slaHighLimit) {
      return 'green';
    }
    // if (value >= environment.slaMedLimit) {
    //   return 'orange';
    // }
    return 'red';
  }

  getSlaData() {
    this.noData = false;
    this.slaWidgetData = {
      graphData: [],
      title: this.title
    };
    if (this.selectBy === 'concentratorId') {
      this.getConcentratorData();
      // get concentrator data ULR
    } else {
      this.getDeviceData();
    }
    this.subscriptions.push(
      this.slaData$.subscribe((res) => {
        this.mapSlaData(res);
      })
    );

    this.subscriptions.push(
      this.nextRead$.subscribe((res) => {
        if (res) {
          this.nextReadDate = res;
        }
      })
    );

    this.subscriptions.push(
      this.lastComm$.subscribe((res) => {
        if (res) {
          this.lastCommunicationDate = res;
        }
      })
    );
  }

  mapSlaData(res: QualityTrendSlaDto) {
    const keys = Object.keys(res.qualityTrendSlaData);
    keys.forEach((item) => {
      if (res.qualityTrendSlaData[item]?.successPercentage || res.qualityTrendSlaData[item]?.successPercentage === 0) {
        this.slaWidgetData.graphData.push({ value: res.qualityTrendSlaData[item].successPercentage, day: new Date(item).getDate() });
      } else {
        this.slaWidgetData.graphData.push({ value: null, day: new Date(item).getDate() });
      }
    });
    if (this.slaWidgetData.graphData.map((item) => item.value).find((el) => el !== null) === undefined) {
      this.noData = true;
    }
  }

  getDeviceData() {
    this.slaData$ = this.getDataV2Service.v2DeviceDeviceIdSlaTrendGet$Json({ deviceId: this.deviceId });
    this.nextRead$ = this.jobsService.deviceDeviceIdNextReadGet({ deviceId: this.deviceId });
    this.lastComm$ = this.concentratorService.getDeviceLastCommunication(this.deviceId);
  }

  getConcentratorData() {
    this.slaData$ = this.getDataV2Service.v2ConcentratorConcentratorIdSlaTrendGet$Json({ concentratorId: this.deviceId });
    this.nextRead$ = this.jobsService.concentratorConcentratorIdNextReadGet({ concentratorId: this.deviceId });
    this.lastComm$ = this.concentratorService.getConcentratorLastCommunication(this.deviceId);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
