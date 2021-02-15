import {Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {ImportPricesComponent} from './import-prices/import-prices.component';


export const UtilitiesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'utility',
                component: ImportPricesComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];
