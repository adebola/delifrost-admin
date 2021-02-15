import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Category {
    id: number;
    name: string;
    image_url: string;
    subCategories: any[];
    close?: boolean;
}

export interface CategoryCount {
    id: number;
}

const CATEGORY_URL = environment.base_url + '/api/v1/categories';

@Injectable({providedIn: 'root'})
export class CategoryService {

    private subject = new BehaviorSubject<Category[]>(null);
    public categories$: Observable<Category[]> = this.subject.asObservable();

    constructor(private http: HttpClient) {}

    public loadCategories(): void {
        this.http.get<Category[]>(CATEGORY_URL).subscribe(o => this.subject.next(o));
    }

    public loadAssignableCategories(): void {
        this.http.get<Category[]>(CATEGORY_URL + '/modified').subscribe(o => this.subject.next(o));
    }

    public getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(CATEGORY_URL);
    }

    public getAvailableCategoriesForSubCategorization(id: number): Observable<Category[]> {
        return this.http.get<Category[]>(CATEGORY_URL + '/subcategory/' + id);
    }

    public getCategoryProductCount(id: number): Observable<CategoryCount> {
        return this.http.get<CategoryCount>(CATEGORY_URL + '/count/' + id);
    }

    getCategoryById(categoryId: number): Observable<Category> {
        return this.http.get<Category>(CATEGORY_URL + '/' + categoryId);
    }

    public  updateCategory(id: number, category: Category): Observable<any> {
        return this.http.put(CATEGORY_URL + '/' + id, category);
    }

    public  saveCategory(category: Category): Observable<any> {
        return this.http.post(CATEGORY_URL, category);
    }

    public deleteCategory(id: number): Observable<any> {
        return this.http.delete(CATEGORY_URL + '/' + id);
    }

    public removeSubCategory(id: number): Observable<any> {
        return this.http.put(CATEGORY_URL + '/subcategory/remove/' + id, {});
    }

    public addSubCategory(id: number, subId: number): Observable<any> {
        return this.http.put(CATEGORY_URL + '/subcategory/add/' + id, subId);
    }
}
