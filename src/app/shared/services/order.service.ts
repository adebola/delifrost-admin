

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

// OrderItem
export class OrderItem {
    id: number;
    order_id: number;
    sku_id: number;
    image_path: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    discount: number;
    total_price: number;
}

// Order
export class Order {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    orderedAt: Date;
    fulfilledAt: Date;
    paymentRef: string;
    transaction_id: string;
    pin: string;
    orderAmount: number;
    pickup: boolean;
    deliver: boolean;
    telephone: string;
    address: string;
    orderItems: OrderItem[];
}

interface FulfillOrder {
    id: number;
    fulfill_date: Date;
}

const ORDER_URL = environment.base_url + '/api/v1/store/orders';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) {}

    public getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(ORDER_URL);
    }

    public getAllOrdersForDelivery(): Observable<Order[]> {
        return this.http.get<Order[]>(ORDER_URL + '/delivery');
    }

    public getOrder(id: number): Observable<Order> {
        return this.http.get<Order>(ORDER_URL + '/' + id);
    }

    public fulfillOrder(id: number, fulfill_date: Date) {
        return this.http.put(ORDER_URL + '/fulfill/' + id, {
            id, fulfill_date
        });
    }

    public generateReport(id: number): Observable<Blob> {
        return this.http.get(ORDER_URL + '/export/pdf/' + id, {responseType: 'blob'});
    }
}
