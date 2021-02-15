import {Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth-guard.service';
import {UserListComponent} from './userlist/user-list.component';
import {UserFormComponent} from './forms/user-form/user-form.component';

export const UsersRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'users',
                component: UserListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'userform',
                component: UserFormComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'userform/:id',
                component: UserFormComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];
