import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Order, OrderService} from '../../../shared/services/order.service';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from '../../../shared/services/notification.service';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-order-form',
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit, OnDestroy {
    private id: string;
    public busy = true;
    public order: Order;
    private subscription: Subscription;
    public orderItemColumns = ['product', 'quantity', 'price'];
    defaultDate = Date.now();
    @ViewChild('date') datePicker: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private notificationService: NotificationService) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.loadOrder();
    }

    onOrderFulfilled() {
        this.notificationService.info('The Order was Fulfilled on ' +  this.order.fulfilledAt);
    }

    onSubmit() {
        const date = this.datePicker.nativeElement.value;

        if (date) {
            this.orderService.fulfillOrder(+this.id, new Date(date)).pipe(
                tap(() => this.loadOrder())
            ).subscribe(o => this.notificationService.success('Order Scheduled Successfully'));
        } else {
            this.notificationService.error('Please select a date');
        }
    }

    private loadOrder() {

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.orderService.getOrder(+this.id).subscribe(o => {
            this.order = o;
        });
    }
}
