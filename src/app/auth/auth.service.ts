import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import {catchError, tap} from 'rxjs/operators';
import {NotificationService} from '../shared/services/notification.service';

interface AuthSignInRequestData {
    username: string;
    password: string;
    captchaResponse: string;
}

export interface AuthSignInResponseData {
    status: number;
    message: string;
    id: string;
    username: string;
    email: string;
    fullName: string;
    telephone: string;
    address: string;
    organization: string;
    token: string;
    roles: string[];
}

const SIGNIN_URL = environment.base_url + '/api/v1/auth/signin';

@Injectable({providedIn: 'root'})
export class AuthService {
    public isLoggedIn = false;
    public userId = 0;
    private subject = new BehaviorSubject<User>(null);
    public user$ = this.subject.asObservable();
    private user: User;
    private tokenExpirationTimer: any;
    private failedReq: string;

    constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {
    }


    login(username: string, password: string, captchaResponse: string): Observable<AuthSignInResponseData> {

        const signInRequest: AuthSignInRequestData = {username, password, captchaResponse};

        const self = this;
        return this.http.post<AuthSignInResponseData>(SIGNIN_URL, signInRequest)
            .pipe(
                catchError(err => {
                    this.handleError(err, self);
                    return throwError(err);
                }),
                tap(response => {
                    this.handleAuthentication(response, self);
                })
            );
    }

    public saveUserToLocalStorage(user: User) {
        localStorage.setItem('userData', JSON.stringify(user ? user : this.user));
    }

    autoLogout(expirationDuration: number) {

        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
            this.notificationService.info('You session has expired and you have been Logged Out');
            console.log('You session has expired and you have been Logged Out');
            this.router.navigate(['/auth']);
        }, expirationDuration);
    }

    autoLogin() {

        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const user: User =
            new User(
                userData.userId,
                userData.username,
                userData.email,
                userData.fullName,
                userData.telephone,
                userData.address,
                userData.organization,
                userData._token,
                new Date(userData._tokenExpirationDate));

        if (user.token) {
            const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();

            if (expirationDuration > 1000) {
                this.autoLogout(expirationDuration);
                this.user = user;
                this.subject.next(user);

                this.userId = user.userId;
                this.isLoggedIn = true;

                if (this.failedReq) {
                    this.router.navigate([this.failedReq]);
                }
            }
        }
    }

    logout() {

        this.isLoggedIn = false;
        this.subject.next(null);
        localStorage.removeItem('userData');
        this.userId = 0;

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    setFailedReq(value: string) {
        this.failedReq = value;
    }

    private handleAuthentication(responseData: AuthSignInResponseData, self: any) {

        if (!responseData.roles.find(s => s === 'ROLE_ADMIN')) {
            this.notificationService.error('You must have admin privileges to login to this service, please contact DELIFROST');
            return this.router.navigate(['/auth']);
        }

        const decoded: any = jwt_decode(responseData.token);
        const expiryDate = new Date(parseInt(decoded.exp, 10) * 1000);
        const nowDate = new Date();

        const expirationDuration = expiryDate.getTime() - nowDate.getTime();

        const user =
            new User(
                +responseData.id,
                responseData.username,
                responseData.email,
                responseData.fullName,
                responseData.telephone,
                responseData.address,
                responseData.organization,
                responseData.token,
                expiryDate
            );

        this.user = user;
        self.subject.next(user);
        self.autoLogout(expirationDuration);
        self.isLoggedIn = true;
        self.userId = user.userId;
        this.saveUserToLocalStorage(user);

        return this.router.navigate(['/admin/dashboard']);
    }

    private handleError(errorResponse: HttpErrorResponse, self: any) {
        let errorMessage = 'Unknown Error Occurred';

        switch (errorResponse.status) {
            case 400:
                errorMessage = 'Bad Request: ' + errorResponse.error.message;
                break;

            case 401:
                errorMessage = 'Invalid User Name or Password';
                break;

            case 500:
                errorMessage = 'Internal Error Authenticating ' + errorResponse.error.message;
                break;
        }

        this.notificationService.error(errorMessage);
        console.log(errorMessage);
    }
}
