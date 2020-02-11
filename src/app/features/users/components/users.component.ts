import { Component, OnInit, ViewChild, TemplateRef, Inject, LOCALE_ID } from '@angular/core';
import { TableQueryResponse } from 'src/app/shared/tables/interfaces/table-response.interface';
import { TableColumn, SortPropDir, SortDirection } from '@swimlane/ngx-datatable';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarService } from 'src/app/shared/base-template/services/sidebar.service';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ModalService } from 'src/app/shared/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FormsUtilsService } from 'src/app/shared/forms/services/forms-utils.service';
import { UsersListRepository } from 'src/app/core/repository/interfaces/user-list-repository.interface';
import { UsersSearchFilter } from '../interfaces/user-list.interface';
import { UsersRepositoryService } from 'src/app/core/repository/services/users/users-repository.service';
import { UsersService } from '../services/users.service';
import { UserRoutes } from '../consts/user-route.const';
import { DateDefaultPipe } from 'src/app/shared/pipes/pipes/date-default.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  data: TableQueryResponse<any>;
  columns: Array<TableColumn> = [];
  sort: SortPropDir = { prop: 'lastName', dir: SortDirection.asc };

  tempRows: UsersListRepository[];

  @ViewChild('actionsColumnTmpl', { static: true }) actionsColumnTmpl: TemplateRef<any>;

  // translated messages
  msgConfirmDeleteModalTitle = $localize`Delete user`;
  msgConfirmDeleteModalBody = $localize`Do you want to delete:`;
  msgDeleteSucceeded = $localize`Selected item deleted`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersRepository: UsersRepositoryService,
    private sidebarService: SidebarService,
    private modalService: ModalService,
    private formUtils: FormsUtilsService,
    private service: UsersService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.sidebarService.headerTitle = $localize`Users`;
  }

  get formFunctionality() {
    return FunctionalityEnumerator.users;
  }

  ngOnInit() {
    this.setColumns();
    this.getData();
  }

  private setColumns() {
    this.columns = [
      { prop: 'firstName', name: $localize`NAME` },
      { prop: 'lastName', name: $localize`LAST NAME` },
      { prop: 'userName', name: $localize`USER NAME` },
      { prop: 'email', name: $localize`EMAIL` },
      { prop: 'accessTypeName', name: $localize`ACCESS TYPE` },
      { prop: 'lastChange', name: $localize`LAST CHANGE`, pipe: new DateDefaultPipe(this.locale, environment.dateTimeFormat) },
      { cellTemplate: this.actionsColumnTmpl, width: 50, minWidth: 50 }
    ];
  }

  onAddClicked() {
    this.router.navigate([UserRoutes.getUser(0)], { relativeTo: this.route });
  }

  onSelect({ selected }: any) {
    this.router.navigate([UserRoutes.getUser(selected[0].id)], { relativeTo: this.route });
  }

  onDelete($event: any, row: UsersListRepository) {
    $event.stopPropagation(); // ngx-datatable: stop row selection

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.modalTitle = `${this.msgConfirmDeleteModalTitle}`;
    component.modalBody = `${this.msgConfirmDeleteModalBody} ${row.firstName} ${row.lastName}?`;

    modalRef.result
      .then(data => {
        this.delete(row.id);
      })
      .catch(e => {
        console.log(e);
      });
  }

  delete(id: number) {
    const request = this.usersRepository.deleteUser(id);
    this.formUtils.deleteForm(request, this.msgDeleteSucceeded).subscribe(() => {});
  }

  private getData() {
    this.usersRepository.getUsersList().subscribe((response: UsersListRepository[]) => {
      this.data = {
        results: response,
        recordCount: 1,
        offset: 0,
        pageSize: 10
      } as TableQueryResponse<any>;
      this.tempRows = [...this.data.results];
    });
  }

  onSearch(formValue: UsersSearchFilter) {
    this.data.results = this.service.search(formValue, this.tempRows);
  }
}
