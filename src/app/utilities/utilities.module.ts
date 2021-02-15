import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UtilitiesRoutes} from './utilities.routing';
import {ImportPricesComponent} from './import-prices/import-prices.component';
import {MaterialModule} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UtilitiesRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ImportPricesComponent
    ]
})
export class UtilitiesModule {}
