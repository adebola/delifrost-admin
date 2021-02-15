import {Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {OrderListComponent} from './orderlist/order-list.component';
import {OrderFormComponent} from './form/order-form/order-form.component';

export const OrdersRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'orders',
                component: OrderListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'orders/:id',
                component: OrderListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'orderform/:id',
                component: OrderFormComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];
