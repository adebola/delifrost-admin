import {Routes} from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {ProductCategoriesComponent} from './product-categories/product-categories.component';
import {CategoryFormComponent} from './forms/category-form/category-form.component';
import {ProductFormComponent} from './forms/product-form/product-form.component';
import {AuthGuard} from '../auth/auth-guard.service';

export const ProductsRoutes: Routes = [
    {
        path: '',
        children: [
        {
            path: 'products',
            component: ProductsComponent,
            canActivate: [AuthGuard]
        }]
    },
    {
        path: '',
        children: [
            {
                path: 'productcategories',
                component: ProductCategoriesComponent,
                canActivate: [AuthGuard]
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'categoryform',
                component: CategoryFormComponent,
                canActivate: [AuthGuard]
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'categoryform/:id',
                component: CategoryFormComponent,
                canActivate: [AuthGuard]
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'productform',
                component: ProductFormComponent,
                canActivate: [AuthGuard]
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'productform/:id',
                component: ProductFormComponent,
                canActivate: [AuthGuard]
            }]
    },
];
