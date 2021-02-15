import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {ProductsComponent} from './products/products.component';
import {ProductsRoutes} from './products.routing';
import {ProductCategoriesComponent} from './product-categories/product-categories.component';
import {CategoryFormComponent} from './forms/category-form/category-form.component';
import {ProductFormComponent} from './forms/product-form/product-form.component';
import {TagInputModule} from 'ngx-chips';
import {CdkDetailRowDirective} from './product-categories/cdk-detail.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProductsRoutes),
        FormsModule,
        MaterialModule,
        TagInputModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProductsComponent,
        ProductCategoriesComponent,
        CategoryFormComponent,
        ProductFormComponent,
        CdkDetailRowDirective
    ]
})
export class ProductsModule {}
