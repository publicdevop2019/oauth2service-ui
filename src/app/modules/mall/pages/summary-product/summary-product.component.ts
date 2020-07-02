import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { interval, Subscription } from 'rxjs';
import { debounce, filter, map, switchMap } from 'rxjs/operators';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { IProductSimple, IProductTotalResponse, ProductService } from 'src/app/services/product.service';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
})
export class SummaryProductComponent implements OnInit, OnDestroy {
  exactSearch = new FormControl('', []);
  rangeSearch = new FormControl('', []);
  displayedColumns: string[] = ['id', 'name', 'priceList', 'totalSales', 'attributesKey', 'star'];
  columnWidth: number;
  dataSource: MatTableDataSource<IProductSimple>;
  pageNumber = 0;
  totoalProductCount = 0;
  pageSizeOffset = 4;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public catalogsData: ICatalogCustomer[];
  constructor(private productSvc: ProductService, private categorySvc: CategoryService, public deviceSvc: DeviceService) {
    this.productSvc.getAllProduct(this.pageNumber || 0, this.getPageSize()).subscribe(products => {
      this.totalProductHandler(products)
    });
    this.categorySvc.getCatalogBackend()
      .subscribe(catalogs => {
        if (catalogs.data)
          this.catalogsData = catalogs.data;
      });
    this.exactSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        return this.productSvc.searchProductById(e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })
    this.rangeSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        this.pageNumber = 0;
        return this.productSvc.searchProductByKeyword(this.pageNumber, this.getPageSize(), e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })
  }
  ngOnDestroy(): void {
  }
  ngOnInit() {
  }
  searchWithTags(catalog: ICatalogCustomer) {
    this.pageNumber = 0;
    this.productSvc.searchProductsByTags(this.pageNumber, this.getPageSize(), catalog.attributesKey).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.pageNumber = e.pageIndex;
    this.productSvc.getAllProduct(this.pageNumber || 0, this.getPageSize()).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  private getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  private totalProductHandler(products: IProductTotalResponse) {
    if (products.data) {
      this.dataSource = new MatTableDataSource(products.data);
      this.totoalProductCount = products.totalProductCount;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.totoalProductCount = 0;
      this.dataSource.sort = this.sort;
    }
  }
  private invalidSearchParam(input: string): boolean {
    let spaces: RegExp = new RegExp(/^\s*$/)
    return !spaces.test(input)
  }
}
