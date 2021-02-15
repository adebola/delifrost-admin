import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs';

export interface TableData {
  headerRow: string[];
  dataRows: [];
}

@Component({
  selector: 'app-md-table',
  templateUrl: './md-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdTableComponent {
  @Input()
  public title: string;

  @Input()
  public subtitle: string;

  @Input()
  public cardClass: string;

  @Input()
  public data$: Observable<TableData>;

  constructor() { }
}
