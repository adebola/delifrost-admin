import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ProductService, ProductSKU} from '../../shared/services/product.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export class ProductsDatasource implements DataSource<ProductSKU> {
    private productSubject = new BehaviorSubject<ProductSKU[]>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private products: ProductSKU[];

    constructor(private productService: ProductService) {}

    get length() {

        if (this.products) {
            return this.products.length;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<ProductSKU[] | ReadonlyArray<ProductSKU>> {
        return this.productSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productSubject.complete();
        this.loadingSubject.complete();
    }

    loadProducts(pageIndex = 0, pageSize = 20, searchString: string = null) {

        if (this.products) {
            if (searchString && searchString.length > 0) {
                return this.productSubject.next(this.products.filter(product => product.name.substring(0, searchString.length) === searchString));
            } else {
                const start = pageIndex * pageSize;
                const end = start + pageSize;

                return this.productSubject.next(this.products.slice(start, end));
            }
        }

        this.loadingSubject.next(true);
        this.productService.getProductSKUs().pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(products => {
            this.products = products;
            this.productSubject.next(products.slice(pageIndex, pageSize));
        });
    }
}
