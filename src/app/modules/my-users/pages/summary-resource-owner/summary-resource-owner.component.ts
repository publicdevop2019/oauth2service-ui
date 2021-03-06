import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_ROLES_USER } from 'src/app/clazz/constants';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { ResourceOwnerComponent } from '../resource-owner/resource-owner.component';
import { OperationConfirmDialogComponent } from 'src/app/components/operation-confirm-dialog/operation-confirm-dialog.component';
import { filter } from 'rxjs/operators';
import * as UUID from 'uuid/v1';
import { IResourceOwner } from 'src/app/clazz/validation/aggregate/user/interfaze-user';
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
})
export class SummaryResourceOwnerComponent extends SummaryEntityComponent<IResourceOwner, IResourceOwner> implements OnDestroy {
  displayedColumns: string[] = ['id', 'email', 'grantedAuthorities', 'locked', 'createdAt', 'edit', 'token', 'delete'];
  sheetComponent = ResourceOwnerComponent;
  roleList = CONST_ROLES_USER;
  constructor(
    public entitySvc: ResourceOwnerService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 2);
  }
  revokeResourceOwnerToken(id: string) {
    this.entitySvc.revokeResourceOwnerToken(id);
  }
  getAuthorityList(inputs: string[]) {
    return inputs.map(e => <IOption>{ label: this.roleList.find(ee => ee.value === e).label, value: e })
  }
  doBatchLock(){
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateUserStatus(ids, 'LOCK', UUID()));
  }
  doBatchUnlock(){
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateUserStatus(ids, 'UNLOCK', UUID()));
  }
}
