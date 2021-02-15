import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const ORDER_URL = environment.base_url + '/api/v1/store/orders';

export interface OrderTotals {
    name: string;
    imagepath: string;
    totals: number;
}

@Injectable({providedIn: 'root'})
export class ReportService {
    constructor(private http: HttpClient) {
    }

    public getOrderTotals(): Observable<OrderTotals[]> {
        return this.http.get<OrderTotals[]>(ORDER_URL + '/totals');
    }
}
