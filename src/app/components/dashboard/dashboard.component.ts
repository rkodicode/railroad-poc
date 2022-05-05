import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DISPLAY_COLUMNS } from 'src/app/common/constants/dashboard.constant';
import { mockData } from 'src/app/common/mock-data';
import {
  DashboardData,
  statData,
} from 'src/app/common/model/dashboard.interface';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  dataSource: MatTableDataSource<DashboardData>;
  displayedColumns: string[] = DISPLAY_COLUMNS;
  searchFilterForm: FormGroup;
  statData: statData;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {}

  ngOnInit() {
    // setting any null values to empty string
    const obj = mockData;
    for (const index in obj) {
      let data = obj[index];
      for (const key in data) {
        if (data[key] === null) {
          data[key] = '';
        }
      }
    }

    this.dataSource = new MatTableDataSource(obj);
    this.searchForm();
    /* Filter predicate used for filtering table per different columns */
    this.dataSource.filterPredicate = this.getFilterPredicate();

    this.statData = {
      totalAccounting: this.findDepartmentTotal('Accounting'),
      totalAdministration: this.findDepartmentTotal('Administration'),
      totalSales: this.findDepartmentTotal('Sales'),
      totalMarketing: this.findDepartmentTotal('Marketing'),
      totalProduction: this.findDepartmentTotal('Production'),
      workingStatusCount: this.findStatusCount('working'),
      deliveredStatusCount: this.findStatusCount('delivered'),
      archivedStatusCount: this.findStatusCount('archived'),
      newStatusCount: this.findStatusCount('new'),
    };
  }
  /* this method will calculate the total budget of each department */
  findDepartmentTotal(department: string): number {
    return mockData
      .filter((data) => data.division === department)
      .reduce((acc, amount) => {
        return acc + amount.budget;
      }, 0);
  }
  /* this method will calculate the number of each project state */
  findStatusCount(statue: string): number {
    return mockData.filter((data) => data.status === statue).length;
  }
  searchForm() {
    this.searchFilterForm = this.fb.group({
      titleInput: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
      divisionInput: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
      projectOwnerInput: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
      budgetInput: ['', [Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      statusInput: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
      createdDateInput: [''],
      modifiedDateInput: [''],
    });
  }
  /* this method well be called for each row in table  */
  getFilterPredicate() {
    return (data: DashboardData, filters: string) => {
      const filterArray = filters.split('-');
      const matchFilter = [];

      matchFilter.push(data.title.toLowerCase().includes(filterArray[0]));
      matchFilter.push(data.division.toLowerCase().includes(filterArray[1]));
      matchFilter.push(
        data.project_owner.toLowerCase().includes(filterArray[2])
      );
      matchFilter.push(data.budget >= Number(filterArray[3]));
      matchFilter.push(data.status.toLowerCase().includes(filterArray[4]));
      if (filterArray[5] !== '' && filterArray[5].length === 10) {
        matchFilter.push(data.created.toString() >= filterArray[5]);
      }
      if (filterArray[6] !== '' && filterArray[6].length === 10) {
        matchFilter.push(data.modified.toString() <= filterArray[6]);
      }

      // push boolean values into array

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }
  /* this method well be called on search inputs  */
  applyFilter() {
    const intlDateOption = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    } as Intl.DateTimeFormatOptions;

    const titleValue = this.searchFilterForm.get('titleInput').value;
    const divisionValue = this.searchFilterForm.get('divisionInput').value;
    const productOwnerValue =
      this.searchFilterForm.get('projectOwnerInput').value;
    const budgetValue = this.searchFilterForm.get('budgetInput').value;
    const statusValue = this.searchFilterForm.get('statusInput').value;
    const createdDateValue =
      this.searchFilterForm.get('createdDateInput').value;
    const modifiedDateValue =
      this.searchFilterForm.get('modifiedDateInput').value;

    const titleSearchValue = titleValue === null ? '' : titleValue;
    const divisionSearchValue = divisionValue === null ? '' : divisionValue;
    const productOwnerSearchValue =
      productOwnerValue === null ? '' : productOwnerValue;
    const budgetSearchValue = budgetValue === null ? '' : budgetValue;
    const statusSearchValue = statusValue === null ? '' : statusValue;

    const createdDateSearchValue =
      createdDateValue === null || createdDateValue === ''
        ? ''
        : new Intl.DateTimeFormat('en-US', intlDateOption).format(
            createdDateValue
          );
    const modifiedDateSearchValue =
      modifiedDateValue === null || modifiedDateValue === ''
        ? ''
        : new Intl.DateTimeFormat('en-US', intlDateOption).format(
            modifiedDateValue
          );

    // create string of our searching values and split if by '-'
    const searchFilterString = `${titleSearchValue}-${divisionSearchValue}-${productOwnerSearchValue}-${budgetSearchValue}-${statusSearchValue}-${createdDateSearchValue}-${modifiedDateSearchValue}`;

    this.dataSource.filter = searchFilterString.trim().toLowerCase();
  }
  /* this method well be called when fields change  */
  updateText(): void {
    alert('you have made changes');
  }
}
