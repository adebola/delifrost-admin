import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface AdminUser {
    id: number;
    email: string;
    username: string;
    fullName: string;
    telephone: string;
    address: string;
    password: string;
    organization: string;
    activated: boolean;
    roles: string[];
}

const USER_URL = environment.base_url + '/api/v1/users';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient) {}

    public getUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(USER_URL);
    }

    public getUserById(id: number): Observable<AdminUser> {
        return this.http.get<AdminUser>(USER_URL + '/' + id);
    }

    public updateUser(id: number, user: AdminUser): Observable<any> {
        return this.http.put(USER_URL + '/admin/' + id, user);
    }

    public saveUser(user: AdminUser): Observable<any> {
        return this.http.post(USER_URL, user);
    }
}
