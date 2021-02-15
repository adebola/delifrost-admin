import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {OrderListDatasource} from './order-list.datasource';
import {NotificationService} from '../../shared/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../shared/services/order.service';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public id: string;
    public busy = false;
    public datasource: OrderListDatasource;
    public displayedColumns = ['id', 'order-date', 'delivery-date', 'amount', 'actions'];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService,
        private notificationService: NotificationService) {}

    ngAfterViewInit(): void {
        this.paginator.page
            .pipe(
                tap(() => this.datasource.loadOrders(this.id ? true : false, this.paginator.pageIndex, this.paginator.pageSize))
            ).subscribe();
    }

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.datasource = new OrderListDatasource(this.orderService);
        this.datasource.loadOrders(this.id ? true : false);
    }

    onView(id) {
        this.router.navigate(['/admin/orders/orderform', id]);
    }

    onInvoiceView(id) {
        this.busy = true;

        this.orderService.generateReport(id).pipe(
            catchError(this.handleError)
        ).subscribe(data => {
            const blob = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(blob);
            this.busy = false;
            window.open(fileURL);
        });
    }

    private handleError(err) {
        console.log('ERROR', err);
        this.notificationService.error(err.message);
        this.busy = false;
        return throwError(err);
    }
}
