import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {OrdersRoutes} from './orders.routing';
import {OrderListComponent} from './orderlist/order-list.component';
import {OrderFormComponent} from './form/order-form/order-form.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrdersRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        OrderListComponent,
        OrderFormComponent
    ]
})
export class OrdersModule {}
