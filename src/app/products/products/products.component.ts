import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Product, ProductService} from '../../shared/services/product.service';
import {fromEvent, throwError} from 'rxjs';
import {NotificationService} from '../../shared/services/notification.service';
import {Router} from '@angular/router';
import {catchError, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ProductsDatasource} from './products.datasource';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input') input: ElementRef;
    public displayedColumns = ['code', 'name', 'category', 'price', 'brand', 'actions'];
    public datasource: ProductsDatasource;

    constructor(
        private notificationService: NotificationService,
        public productService: ProductService,
        private router: Router) {}

    ngOnInit(): void {
        this.datasource = new ProductsDatasource(this.productService);
        this.datasource.loadProducts();
    }

    ngAfterViewInit() {

        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.datasource.loadProducts(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value);
                })
            ).subscribe();

        this.paginator.page
            .pipe(
                tap(() => this.datasource.loadProducts(this.paginator.pageIndex, this.paginator.pageSize))
            ).subscribe();
    }

    ngOnDestroy() {}

    onNew() {
        this.router.navigate(['/admin/products/productform']);
    }

    onEdit(id: number) {
        this.router.navigate(['/admin/products/productform', id]);
    }

    onDelete(id: number) {
        this.productService.deleteProduct(id).pipe(
            catchError(err => {
                this.notificationService.info('Unable to delete Product, this due to  established dependencies');
                return throwError(err);
            })
        ).subscribe(() => {
            this.notificationService.success('The Product has been deleted successfully');
            this.datasource.loadProducts();
        });

    }
}
