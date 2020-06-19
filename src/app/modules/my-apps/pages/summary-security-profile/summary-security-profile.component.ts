import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SecurityProfileService } from 'src/app/services/security-profile.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatSlideToggle } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ISecurityProfile {
  resourceId: string;
  lookupPath: string;
  method: string;
  expression: string;
  id: number;
  scheme?: string;
  host?: string;
  port?: string;
  path?: string;
}
@Component({
  selector: 'app-summary-security-profile',
  templateUrl: './summary-security-profile.component.html',
  styleUrls: ['./summary-security-profile.component.css']
})
export class SummarySecurityProfileComponent implements OnInit, OnDestroy {
  header: string;
  displayedColumns: string[] = ['id', 'resourceId', 'path', 'method', 'star'];
  dataSource: MatTableDataSource<ISecurityProfile>;
  batchUpdateForm = new FormGroup({
    host: new FormControl('', []),
  });
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSlideToggle, { static: true }) slide: MatSlideToggle;
  selection = new SelectionModel<ISecurityProfile>(true, []);
  private sub: Subscription;
  constructor(public securityProfileSvc: SecurityProfileService, private breakpointObserver: BreakpointObserver) {
    this.securityProfileSvc.readAll().subscribe(profiles => {
      this.dataSource = new MatTableDataSource(profiles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.sub = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(next => {
      if (next.breakpoints[Breakpoints.XSmall]) {
        this.displayedColumns = ['resourceId', 'path', 'method'];
      }
      else if (next.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['resourceId', 'path', 'method'];
      }
      else if (next.breakpoints[Breakpoints.Medium]) {
        this.displayedColumns = ['id', 'resourceId', 'path', 'method', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Large]) {
        this.displayedColumns = ['id', 'resourceId', 'path', 'method', 'star'];
      }
      else if (next.breakpoints[Breakpoints.XLarge]) {
        this.displayedColumns = ['id', 'resourceId', 'path', 'method', 'star'];
      }
      else {
        console.warn('unknown device width match!')
      }
      if (this.slide && this.slide.checked && !this.displayedColumns.includes('select')) {
        this.displayedColumns = ['select', ...this.displayedColumns]
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  showOptions() {
    if (!this.displayedColumns.includes('select')) {
      this.displayedColumns = ['select', ...this.displayedColumns]
    } else {
      this.displayedColumns = this.displayedColumns.filter(e => e !== 'select')

    }
  }
  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.securityProfileSvc.currentPageIndex = e.pageIndex
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ISecurityProfile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  doBatchUpdate() {
    let form = {};
    let ids = this.selection.selected
      .filter(e => e.scheme !== null && e.scheme !== undefined)
      .map(e => String(e.id));
    form['host'] = this.batchUpdateForm.get('host').value;
    form['ids'] = ids.join(',');
    this.securityProfileSvc.batchUpdate(form);
  }

}