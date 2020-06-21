import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IProductDetail, ProductService, IProductOptions, IProductOption } from 'src/app/services/product.service';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG, FORM_CONFIG_IMAGE, FORM_CONFIG_OPTIONS } from 'src/app/form-configs/product.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FormInfoService } from 'mt-form-builder';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { TranslateService } from '@ngx-translate/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CatalogCustomerFlatNode } from '../summary-catalog/summary-catalog.component';
import { ICatalogCustomerTreeNode, ICatalogCustomer, CategoryService, ICatalogCustomerHttp } from 'src/app/services/category.service';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { ATTR_FORM_CONFIG } from 'src/app/form-configs/attribute.config';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  product$: Observable<IProductDetail>;
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrFormId = 'attr';
  attrFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_FORM_CONFIG));
  validator: ValidateHelper;
  imageFormId = 'product_image';
  imageFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_IMAGE));
  imageFormvalidator: ValidateHelper;
  optionFormId = 'product_option';
  optionFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_OPTIONS));
  optionFormvalidator: ValidateHelper;
  subs: Subscription[] = [];
  treeControl = new FlatTreeControl<CatalogCustomerFlatNode>(node => node.level, node => node.expandable);
  private _transformer = (node: ICatalogCustomerTreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      tags: node.tags
    };
  }
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private route: ActivatedRoute,
    public productSvc: ProductService,
    private httpProxy: HttpProxyService,
    private fis: FormInfoService,
    public translate: TranslateService,
    private categorySvc: CategoryService,
    public attrSvc: AttributeService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis);
    this.imageFormvalidator = new ValidateHelper(this.imageFormId, this.imageFormInfo, this.fis);
    this.optionFormvalidator = new ValidateHelper(this.optionFormId, this.optionFormInfo, this.fis);
  }
  ngAfterViewInit(): void {
    this.subs.push(
      this.route.queryParamMap.subscribe(queryMaps => {
        this.state = queryMaps.get('state');
        if (queryMaps.get('state') === 'update') {
          let showCtrls = ['decreaseActualStorageBy', 'increaseActualStorageBy', 'decreaseOrderStorageBy', 'increaseOrderStorageBy'];
          let hideCtrls = ['orderStorage', 'actualStorage'];
          this.formInfo.inputs.forEach(e => {
            if (showCtrls.indexOf(e.key) > -1)
              e.display = true;
            if (hideCtrls.indexOf(e.key) > -1)
              e.display = false;
          });
          this.subs.push(this.product$.subscribe(byId => {
            this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id)
            this.fis.formGroupCollection[this.formId].get('attributes').setValue(byId.attributes)
            this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name)
            this.fis.formGroupCollection[this.formId].get('price').setValue(byId.price)
            this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(byId.imageUrlSmall)
            this.fis.formGroupCollection[this.formId].get('description').setValue(byId.description)
            this.fis.formGroupCollection[this.formId].get('sales').setValue(byId.sales)
            this.fis.formGroupCollection[this.formId].get('rate').setValue(byId.rate)
            if (byId.imageUrlLarge && byId.imageUrlLarge.length !== 0) {
              byId.imageUrlLarge.forEach((url, index) => {
                if (index === 0) {
                  this.fis.formGroupCollection[this.imageFormId].get('imageUrl').setValue(url);
                } else {
                  this.fis.formGroupCollection[this.imageFormId].addControl('imageUrl_' + this.fis.formGroupCollection_index[this.imageFormId], new FormControl(url));
                  this.fis.add(this.imageFormId);
                }
                this.fis.refreshLayout(this.imageFormInfo, this.imageFormId);
              })
            }
            if (byId.selectedOptions && byId.selectedOptions.length !== 0) {
              byId.selectedOptions.forEach((option, index) => {
                if (index === 0) {
                  this.fis.formGroupCollection[this.optionFormId].get('productOption').setValue(option.title);
                  //for child form
                  option.options.forEach((opt, index) => {
                    if (index == 0) {
                      this.fis.formGroupCollection['optionForm'].get('optionValue').setValue(opt.optionValue);
                      this.fis.formGroupCollection['optionForm'].get('optionPriceChange').setValue(opt.priceVar);
                    } else {
                      this.fis.formGroupCollection['optionForm'].addControl('optionValue_' + this.fis.formGroupCollection_index['optionForm'], new FormControl(opt.optionValue));
                      this.fis.formGroupCollection['optionForm'].addControl('optionPriceChange_' + this.fis.formGroupCollection_index['optionForm'], new FormControl(opt.priceVar));
                      this.fis.add('optionForm');
                    }
                  })
                  this.fis.refreshLayout(this.fis.formGroupCollection_formInfo['optionForm'], 'optionForm');
                  //for child form
                } else {
                  let indexSnapshot = this.fis.formGroupCollection_index[this.optionFormId];
                  this.fis.formGroupCollection[this.optionFormId].addControl('productOption_' + indexSnapshot, new FormControl(option.title));
                  /**
                   * @note set child form need to wait for all params to be created
                   */
                  setTimeout((i) => {
                    //for child form
                    let childFormId = 'optionForm_' + i;
                    option.options.forEach((opt, index) => {
                      if (index == 0) {
                        this.fis.formGroupCollection[childFormId].get('optionValue').setValue(opt.optionValue);
                        this.fis.formGroupCollection[childFormId].get('optionPriceChange').setValue(opt.priceVar);
                      } else {
                        this.fis.formGroupCollection[childFormId].addControl('optionValue_' + this.fis.formGroupCollection_index[childFormId], new FormControl(opt.optionValue));
                        this.fis.formGroupCollection[childFormId].addControl('optionPriceChange_' + this.fis.formGroupCollection_index[childFormId], new FormControl(opt.priceVar));
                        this.fis.add(childFormId);
                      }
                    });
                    this.fis.refreshLayout(this.fis.formGroupCollection_formInfo[childFormId], childFormId);
                    //for child form
                  }, 0, indexSnapshot)
                  this.fis.add(this.optionFormId);
                }
              });
              this.fis.refreshLayout(this.optionFormInfo, this.optionFormId);
            }
          }))
        } else if (queryMaps.get('state') === 'none') {

        } else {

        }
      })
    );
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.imageFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.imageFormId]);
    this.optionFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.optionFormId]);
    this.subs.push(this.fis.formGroupCollection[this.formId].get('imageUrlSmallFile').valueChanges.subscribe((next) => { this.uploadFile(next) }));
  }
  attrList: IAttribute[];
  fetchAttrList() {
    this.attrSvc.getAttributeList().subscribe(next => {
      this.attrList = next.data;
      this.attrFormInfo.inputs[0].options = next.data.map(e => <IOption>{ label: e.name, value: String(e.id) })
      this.attrFormInfo.inputs[0].display = true;
    });
    this.fis.formGroupCollection[this.attrFormId].get('attributeId').valueChanges.subscribe(next => {
      let selected = this.attrList.find(e => String(e.id) === next);
      this.attrFormInfo.inputs[1].display = selected.method === 'SELECT';
      this.attrFormInfo.inputs[2].display = selected.method !== 'SELECT';
      if (selected.method === 'SELECT') {
        this.attrFormInfo.inputs[1].options = selected.value.split(',').map(e => <IOption>{ label: e, value: e })
      }
    })
    this.fis.formGroupCollection[this.attrFormId].get('attributeValueSelect').valueChanges.subscribe(next => {
      if (next !== null && next !== undefined)
        this.showAddAttrBtn = true;
    })
    this.fis.formGroupCollection[this.attrFormId].get('attributeValueManual').valueChanges.subscribe(next => {
      if (next !== null && next !== undefined)
        this.showAddAttrBtn = true;
    })
  }
  ngOnDestroy(): void {
    this.subs.forEach(e => e.unsubscribe());
    if (this.fis.formGroupCollection[this.formId]) this.fis.formGroupCollection[this.formId].reset();
    delete this.fis.formGroupCollection[this.imageFormId];
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  private updateFormLabel() {
    this.formInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.imageFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.optionFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    //nested form
    this.optionFormInfo.inputs.filter(e => e.form)[0].form.inputs.forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
  }
  private catalogs: ICatalogCustomerHttp;
  ngOnInit() {
    this.updateFormLabel();
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.updateFormLabel();
    })
    this.subs.push(this.sub);
    this.categorySvc.getCatalogBackend()
      .subscribe(next => {
        if (next.data) {
          this.catalogs = next;
          this.treeDataSource.data = this.convertToTree(next.data);
        }
      });
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productSvc.getProductDetailById(+params.get('id')))
    );

  }
  convertToPayload(): IProductDetail {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let valueSnapshot = this.fis.formGroupCollection[this.imageFormId].value;
    let imagesUrl = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string);
    let selectedOptions: IProductOptions[] = [];
    Object.keys(this.fis.formGroupCollection[this.optionFormId].controls).filter(e => e.indexOf('productOption') > -1).forEach((opt) => {
      let var1 = <IProductOptions>{};
      var1.title = this.fis.formGroupCollection[this.optionFormId].get(opt).value;
      var1.options = [];
      let fg = this.fis.formGroupCollection['optionForm' + opt.replace('productOption', '')];
      var1.options = Object.keys(fg.controls).filter(e => e.indexOf('optionValue') > -1).map(e => {
        return <IProductOption>{
          optionValue: fg.get(e).value,
          priceVar: fg.get(e.replace('optionValue', 'optionPriceChange')).value,
        }
      });
      selectedOptions.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      attributes: formGroup.get('attributes').value,
      name: formGroup.get('name').value,
      price: formGroup.get('price').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description: formGroup.get('description').value,
      sales: formGroup.get('sales').value,
      rate: formGroup.get('rate').value,
      imageUrlLarge: imagesUrl,
      selectedOptions: selectedOptions.filter(e => e.title !== ''),
      orderStorage: formGroup.get('orderStorage').value,
      increaseOrderStorageBy: formGroup.get('increaseOrderStorageBy').value,
      decreaseOrderStorageBy: formGroup.get('decreaseOrderStorageBy').value,
      actualStorage: formGroup.get('actualStorage').value,
      increaseActualStorageBy: formGroup.get('increaseActualStorageBy').value,
      decreaseActualStorageBy: formGroup.get('decreaseActualStorageBy').value
    }
  }
  private uploadFile(files: FileList) {
    this.httpProxy.netImpl.uploadFile(files.item(0)).subscribe(next => {
      this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(next)
    })
  }
  hasChild = (_: number, node: CatalogCustomerFlatNode) => node.expandable;
  notLeafNode(catalogs: ICatalogCustomer[], nodes: ICatalogCustomerTreeNode[]): boolean {
    return nodes.filter(node => {
      return catalogs.filter(el => el.parentId === node.id).length >= 1
    }).length >= 1
  }
  convertToTree(catalogs: ICatalogCustomer[]): ICatalogCustomerTreeNode[] {
    let rootNodes = catalogs.filter(e => e.parentId === null || e.parentId === undefined);
    let treeNodes = rootNodes.map(e => <ICatalogCustomerTreeNode>{
      id: e.id,
      name: e.name,
      tags: e.attributes
    });
    let currentLevel = treeNodes;
    while (this.notLeafNode(catalogs, currentLevel)) {
      let nextLevelCol: ICatalogCustomerTreeNode[] = []
      currentLevel.forEach(childNode => {
        let nextLevel = catalogs.filter(el => el.parentId === childNode.id).map(e => <ICatalogCustomerTreeNode>{
          id: e.id,
          name: e.name,
          tags: e.attributes
        });
        childNode.children = nextLevel;
        nextLevelCol.push(...nextLevel);
      });
      currentLevel = nextLevelCol;
    }
    return treeNodes;
  }
  loadAttributes(id: number) {
    let tags: string[] = [];
    let attr = this.catalogs.data.find(e => e.id === id);
    tags.push(...attr.attributes);
    while (attr.parentId !== null && attr.parentId !== undefined) {
      let nextId = attr.parentId;
      attr = this.catalogs.data.find(e => e.id === nextId);
      tags.push(...attr.attributes);
    }
    this.fis.formGroupCollection[this.formId].get('attributes').setValue(tags);
  }
  public showAddAttrBtn = false;
  addAttrToProduct() {
    let ctrl = this.fis.formGroupCollection[this.formId].get('attributes');
    let at = this.attrList.find(e => String(e.id) === this.fis.formGroupCollection[this.attrFormId].get('attributeId').value);
    if (at.method === 'SELECT') {
      this.fis.formGroupCollection[this.formId].get('attributes').setValue(ctrl.value + ',' + at.name + ':' + this.fis.formGroupCollection[this.attrFormId].get('attributeValueSelect').value);
    }
    else {
      this.fis.formGroupCollection[this.formId].get('attributes').setValue(ctrl.value + ',' + at.name + ':' + this.fis.formGroupCollection[this.attrFormId].get('attributeValueManual').value);
    }
  }
}
