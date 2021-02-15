import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Category, CategoryService} from '../../shared/services/category.service';
import {BehaviorSubject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotificationService} from '../../shared/services/notification.service';
import {ProductCategoriesDatasource} from './product-categories.datasource';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CdkDetailRowDirective } from './cdk-detail.directive';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-product-categories',
    templateUrl: './product-categories.component.html',
    styleUrls: ['./product-categories.component.css'],
    animations: [
        trigger('detailExpand', [
            state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
            state('*', style({height: '*', visibility: 'visible'})),
            transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})

export class ProductCategoriesComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() singleChildRowDetail: boolean;
    public displayedColumns = ['id', 'category', 'image', 'actions'];
    public datasource: ProductCategoriesDatasource;
    private openedRow: CdkDetailRowDirective;
    isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

    constructor(
        private notificationService: NotificationService,
        private categoriesService: CategoryService,
        private router: Router) {}

    ngOnInit(): void {
        this.datasource = new ProductCategoriesDatasource(this.categoriesService, this.paginator, this.sort);
        this.datasource.loadCategories();
    }

    ngOnDestroy() {}

    onToggleChange(cdkDetailRow: CdkDetailRowDirective, row): void {
        if (this.singleChildRowDetail && this.openedRow && this.openedRow.expended) {
            this.openedRow.toggle();
        }

        if (!row.close) {
            row.close = true;
        } else {
            row.close = false;
        }

        this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    }


    onEdit(id: number) {
        this.router.navigate(['/admin/products/categoryform', id]);
    }

    onDelete(id: number) {
        this.categoriesService.deleteCategory(id).pipe(
            catchError(err => {
                this.notificationService.info('Unable to delete category, this maybe due to  established dependencies');
                return throwError(err);
            })
        ).subscribe(() => {
            this.notificationService.success('The Category has been deleted successfully');
            this.datasource.loadCategories();
        });
    }

    onNew() {
        this.router.navigate(['/admin/products/categoryform']);
    }

    onNewSubCategory(id: number) {
        
    }
}
