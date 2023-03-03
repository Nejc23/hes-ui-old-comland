import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { TemplateList } from 'src/app/api/templating/template-list';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { GridColumn, GridColumnType, GridRowAction, PageChangedEvent } from 'src/app/shared/data-table/data-table.component';
import { enumSearchFilterOperators } from 'src/environments/config';
import { PlcMeterTemplatesImportComponent } from '../../meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';
import { ModalService } from '../../../core/modals/services/modal.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations-list.component.html',
  styleUrls: ['./configurations-list.component.scss']
})
export class ConfigurationsListComponent implements OnInit {
  pageNumber = 1;
  totalCount = 0;
  pageSize = 20;
  searchText = '';
  loading = false;
  useWildcards = false;
  gridData: TemplateList[];

  gridColumns: GridColumn[] = [
    {
      field: 'name',
      translationKey: 'GRID.NAME',
      width: 150,
      type: GridColumnType.BOLD_TEXT
    },
    {
      field: 'description',
      translationKey: 'GRID.DESCRIPTION',
      width: 200
    },
    {
      field: 'templateType',
      translationKey: 'GRID.TYPE',
      width: 150,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'METER',
          color: 'white-on-blue'
        },
        {
          enumValue: 'CONCENTRATOR',
          color: 'white-on-green'
        }
      ]
    }
  ];

  sort: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc'
    }
  ];

  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [
      {
        colId: 'name',
        sort: 'asc'
      }
    ],
    searchModel: []
  };

  configurationRowActions: Array<GridRowAction> = [
    {
      actionName: 'details',
      iconName: 'eye-icon'
    }
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private elRef: ElementRef,
    private router: Router,
    private templatingService: TemplatingService,
    private translate: TranslateService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setPageName(this.translate.instant('MENU.CONFIGURATIONS'));
    this.getData();
  }

  getData() {
    this.loading = true;
    this.setRequestData();

    this.templatingService.getTemplates(this.requestModel, this.pageNumber - 1, this.pageSize).subscribe((data) => {
      this.gridData = data.data;
      this.totalCount = data.totalCount;
      this.loading = false;
    });
  }

  setRequestData() {
    this.requestModel.searchModel = [
      {
        colId: 'all',
        type: enumSearchFilterOperators.like,
        value: this.searchText,
        useWildcards: this.useWildcards
      }
    ];
  }

  loadMoreData(event: PageChangedEvent) {
    this.pageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.pageSize) {
      this.pageNumber = 1;
      this.pageSize = event.rowsPerPage;
    }
    this.getData();
  }

  searchData($event: string) {
    this.searchText = $event;
    this.pageNumber = 1;
    this.getData();
  }

  sortChange(sort: SortDescriptor[]) {
    if (sort[0].dir || sort[0].field === 'timeStamp') {
      this.requestModel.sortModel = [
        {
          colId: sort[0].field,
          sort: sort[0].dir
        }
      ];
    } else {
      // if no direction is given, fall back to default sort
      this.requestModel.sortModel = [
        {
          colId: 'name',
          sort: 'asc'
        }
      ];
    }
    this.getData();
  }

  toggleWildcards($event: boolean) {
    this.useWildcards = $event;
    this.getData();
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 220;
  }

  openDetailsPage(event: any) {
    this.router.navigate([`/configuration/details/${event.rowData?.templateId}`]);
  }

  openImportTemplateConfigurationsModal() {
    const modalRef = this.modalService.open(PlcMeterTemplatesImportComponent);

    modalRef.result.then(
      (data) => {
        modalRef.close();
        this.getData();
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }
}
