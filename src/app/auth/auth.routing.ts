import {Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoginComponent
            },
            {
                path: '401',
                component: NotAuthorizedComponent
            }
        ]
    }
];
