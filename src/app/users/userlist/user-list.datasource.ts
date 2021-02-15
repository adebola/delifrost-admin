import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {AdminUser, UserService} from '../../shared/services/user.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class UserListDatasource implements DataSource<AdminUser> {
    private userSubject = new BehaviorSubject<AdminUser[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private adminUser: AdminUser[];

    constructor(private userService: UserService) {}

    connect(collectionViewer: CollectionViewer): Observable<AdminUser[] | ReadonlyArray<AdminUser>> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    get length() {

        if (this.adminUser) {
            return this.adminUser.length;
        }

        return 0;
    }

    loadUsers(pageIndex = 0, pageSize = 20) {

        if (this.adminUser) {
            const start = pageIndex * pageSize;
            const end = start + pageSize;

            return this.userSubject.next(this.adminUser.slice(start, end));
        }

        this.loadingSubject.next(true);
        this.userService.getUsers().pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(users => {
            this.adminUser = users;
            this.userSubject.next(users.slice(pageIndex, pageSize));
        });
    }
}
