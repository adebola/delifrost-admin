import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../shared/services/notification.service';
import {AuthService} from '../auth.service';
import {catchError, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
declare var grecaptcha: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    public loginForm: FormGroup;
    public captchaError = false;
    private subscription: Subscription;
    public busy = false;
    private emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private element: ElementRef,
        private authService: AuthService,
        private notificationService: NotificationService) {

        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        this.createForm();
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('navbar-collapse')[0];

        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    private createForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(this.emailRegx)]],
            password: ['', [Validators.required]]
        });
    }

    ngOnDestroy() {
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('login-page');
      body.classList.remove('off-canvas-sidebar');
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            return this.notificationService.error('Invalid Form');
        }

        const response = grecaptcha.getResponse();
        if (response.length === 0) {
            return this.captchaError = true;
        }

        const email = form.value.email;
        const password = form.value.password;

        this.busy = true;

        this.subscription = this.authService.login(email, password, response)
            .pipe(
                catchError(err => {
                    grecaptcha.reset();
                    this.busy = false;
                    return throwError(err);
                })
            ).subscribe(() => {
                grecaptcha.reset();
                this.busy = false;
            });
    }

    resolved(captchaResponse: string) {}
}
