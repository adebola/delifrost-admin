import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from './auth/auth.service';

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    private _router: Subscription;

    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.autoLogin();

        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            const body = document.getElementsByTagName('body')[0];
            const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
            if (body.classList.contains('modal-open')) {
                body.classList.remove('modal-open');
                modalBackdrop.remove();
            }
        });
    }
}
