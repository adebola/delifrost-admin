import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification.service';
import {AdminUser, UserService} from '../../../shared/services/user.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    // styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
    public userForm: FormGroup;
    public editMode = false;
    public busy = false;
    public serverLoading = false;
    private id: string;
    private subscription: Subscription;
    private user: AdminUser;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private notificationService: NotificationService) {}

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

        if (this.id) {
            this.editMode = true;
            this.busy = true;
        }

        this.createForm();
    }

    private createForm() {
        if (this.editMode) {
            this.subscription = this.userService.getUserById(+this.id).pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                })
            ).subscribe(user => {

                if (user === null) {
                    this.notificationService.error('Error Loading User from the database, please contact support');
                    return this.router.navigate(['/admin/users/users']);
                }

                this.busy = false;
                this.user = user;

                this.userForm = this.fb.group({
                    email: [user.email, Validators.required],
                    password: [null],
                    fullname: [user.fullName, Validators.required],
                    telephone: [user.telephone, [Validators.required, Validators.minLength(11), Validators.pattern('[0-9]+')]],
                    organization: [user.organization],
                    activated: [user.activated],
                    admin: [!!user.roles.find(o => o === 'ROLE_ADMIN')],
                    address: [user.address, Validators.required],
                });
            });
        } else {
            this.userForm = this.fb.group({
                email: [null, Validators.required],
                password: [null, Validators.required],
                fullname: [null, Validators.required],
                telephone: [null, [Validators.required, Validators.minLength(11), Validators.pattern('[0-9]+')]],
                organization: [null],
                activated: [false],
                admin: [false],
                address: [null],
            });
        }
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const email = form.value.email;
        const password = form.value.password;
        const fullName = form.value.fullname;
        const telephone = form.value.telephone;
        const organization = form.value.organization;
        const activated = form.value.activated;
        const admin = form.value.admin;
        const address = form.value.address;

        this.serverLoading = true;

        if (this.editMode) {
            return this.userService.updateUser(+this.id, {
                id: null,
                username: email,
                email, fullName, telephone, organization, activated, address, password,
                roles: admin ? ['admin'] : null
            }).pipe(
                catchError(err => this.handleError(err)),
                finalize(() => this.serverLoading = false)
            ).subscribe(() => this.handleSuccess());
        } else {
            return this.userService.saveUser({
                id: null,
                username: email,
                email, fullName, telephone, organization, activated, address, password,
                roles: admin ? ['admin'] : ['user']
            }).pipe(
                catchError(err => this.handleError(err)),
                finalize(() => this.serverLoading = false)
            ).subscribe(() => this.handleSuccess());
        }
    }

    private handleSuccess() {
        this.router.navigate(['/admin/users/users']);
        this.notificationService.success('The User has been saved successfully');
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        return throwError(err);
    }

}

