import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [{
            path: '',
            loadChildren: './auth/auth.module#AuthModule'
        }]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'products',
                loadChildren: './products/products.module#ProductsModule'
            },
            {
                path: 'users',
                loadChildren: './users/users.module#UsersModule'
            },
            {
                path: 'orders',
                loadChildren: './orders/orders.module#OrdersModule'
            },
            {
                path: 'utility',
                loadChildren: './utilities/utilities.module#UtilitiesModule'
            }]
    }
];
