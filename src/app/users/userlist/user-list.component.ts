import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UserListDatasource} from './user-list.datasource';
import {NotificationService} from '../../shared/services/notification.service';
import {Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public displayedColumns = ['id', 'email', 'roles', 'actions'];
    public datasource: UserListDatasource;

    constructor(
        private notificationService: NotificationService,
        public userService: UserService,
        private router: Router) {}

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.datasource = new UserListDatasource(this.userService);
        this.datasource.loadUsers();
    }

    ngAfterViewInit() {

        this.paginator.page
            .pipe(
                tap(() => this.datasource.loadUsers(this.paginator.pageIndex, this.paginator.pageSize))
            ).subscribe();
    }

    onNew() {
        this.router.navigate(['/admin/users/userform']);
    }

    onEdit(id) {
        this.router.navigate(['/admin/users/userform', id]);
    }

    onDelete(id) {}
}
