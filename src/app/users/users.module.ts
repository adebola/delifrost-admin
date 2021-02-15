import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UsersRoutes} from './users.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../app.module';
import {UserListComponent} from './userlist/user-list.component';
import {RolesPipe} from './userlist/roles.pipe';
import {UserFormComponent} from './forms/user-form/user-form.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsersRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        UserListComponent,
        UserFormComponent,
        RolesPipe
    ]
})
export class UsersModule {}
