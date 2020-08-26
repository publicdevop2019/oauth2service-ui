import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Subscription } from 'rxjs';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/resource-owner.config';
import { IAuthority } from 'src/app/modules/my-apps/interface/client.interface';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { IResourceOwner } from '../../interface/resource-owner.interface';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-resource-owner',
  templateUrl: './resource-owner.component.html',
  styleUrls: ['./resource-owner.component.css']
})
export class ResourceOwnerComponent implements OnInit, AfterViewInit, OnDestroy {
  resourceOwner: IResourceOwner;
  formId = 'resourceOwner';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    public resourceOwnerService: ResourceOwnerService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ResourceOwnerComponent>
  ) {
    this.resourceOwner = data as IResourceOwner;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    if (this.resourceOwner) {
      this.fis.formGroupCollection[this.formId].get('id').setValue(this.resourceOwner.id)
      this.fis.formGroupCollection[this.formId].get('email').setValue(this.resourceOwner.email)
      this.fis.formGroupCollection[this.formId].get('authority').setValue(this.resourceOwner.grantedAuthorities.map(e => e.grantedAuthority))
      this.fis.formGroupCollection[this.formId].get('locked').setValue(this.resourceOwner.locked)
      this.fis.formGroupCollection[this.formId].get('subNewOrder').setValue(this.resourceOwner.subscription)
    }
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  ngOnInit() {
  }

  convertToResourceOwner(): IResourceOwner {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let authority: IAuthority[] = [];
    if (Array.isArray(formGroup.get('authority').value)) {
      authority = (formGroup.get('authority').value as Array<string>).map(e => {
        return <IAuthority>{
          grantedAuthority: e
        }
      })
    }
    return {
      id: formGroup.get('id').value,
      email: formGroup.get('email').value,
      locked: formGroup.get('locked').value,
      subscription: formGroup.get('subNewOrder').value,
      grantedAuthorities: authority
    }
  }
  doUpdate(){
    this.resourceOwnerService.updateResourceOwner(this.convertToResourceOwner(),UUID())
  }
}
