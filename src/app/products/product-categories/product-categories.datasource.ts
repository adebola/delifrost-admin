import {Category, CategoryService} from '../../shared/services/category.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

export class ProductCategoriesDatasource implements DataSource<Category> {

    private categorySubject = new BehaviorSubject<Category[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private categories: Category[];

    constructor(
        private categoryService: CategoryService,
        private paginator: MatPaginator,
        private sort: MatSort) {}

    get length () {

        if (this.categories) {
            return this.categories.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<Category[] | ReadonlyArray<Category>> {

        return this.categorySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.categorySubject.complete();
        this.loadingSubject.complete();
    }

    loadCategories() {
        this.loadingSubject.next(true);

        this.categoryService.getCategories().pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(categories => {
            this.categories = categories;
            this.categorySubject.next(categories);
        });
    }

    compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
