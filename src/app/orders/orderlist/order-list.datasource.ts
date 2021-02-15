import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Order, OrderService} from '../../shared/services/order.service';
import {catchError, finalize} from 'rxjs/operators';

export class OrderListDatasource implements DataSource<Order> {
    private orderSubject = new BehaviorSubject<Order[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private orders: Order[];

    constructor(private orderService: OrderService) {}

    get length() {

        if (this.orders) {
            return this.orders.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Order[] | ReadonlyArray<Order>> {
        return this.orderSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.orderSubject.complete();
        this.loadingSubject.complete();
    }

    loadOrders( today = false, pageIndex = 0, pageSize = 20) {

        // const start = pageIndex * pageSize;
        // const end = start + pageSize;

        this.loadingSubject.next(true);

        const orders$: Observable<Order[]> = today ? this.orderService.getAllOrdersForDelivery() : this.orderService.getAllOrders();

        orders$.pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(orders => {
            this.orders = orders;
            this.orderSubject.next(orders.slice(pageIndex, pageSize));
        });
    }
}
