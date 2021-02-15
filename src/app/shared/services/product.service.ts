import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

export interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    brand: string;
    description: string;
}

export interface ProductSKU {
    productId: number;
    name: string;
    category: string;
    categoryId: number;
    brand: string;
    bundles: Bundle[];
}

export interface Bundle {
    id: number;
    sku: string;
    price: number;
    discount: number;
    description: string;
    isNew: boolean;
    onSale: boolean;
    discontinued: boolean;
    vatExclusive: boolean;
    quantity: number;
    imagePath: string[];
    variantOptions: Variant[];
}

export interface Variant {
    id: number;
    variantName: string;
    variantOption: string;
}

export interface ProductTag {
    id: number;
    productId: number;
    tagName: string;
}

const PRODUCT_URL = environment.base_url + '/api/v1/products';
const PRODUCT_SKU_URL = environment.base_url + '/api/v1/products/sku';

@Injectable({providedIn: 'root'})
export class ProductService {

    constructor(private http: HttpClient) {}

    public getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(PRODUCT_URL);
    }

    public getProductSKUs(): Observable<ProductSKU[]> {
        return this.http.get<ProductSKU[]>(PRODUCT_SKU_URL);
    }

    updateProduct(id: number, product: Product): Observable<any> {
        return this.http.put(PRODUCT_URL + '/' + id, product);
    }

    saveProduct(product: Product) {
        return this.http.post(PRODUCT_URL, product);
    }

    deleteProduct(id: number) {
        return this.http.delete(PRODUCT_URL + '/' + id);
    }

    public getProductSKUById(productId: number): Observable<ProductSKU> {
        return this.http.get<ProductSKU>(PRODUCT_SKU_URL + '/' + productId);
    }

    public updateProductSKU(id: number, productSKU: ProductSKU): Observable<any> {
       return this.http.put(PRODUCT_SKU_URL + '/' + id, productSKU);
    }

    public saveProductSKU(productSKU: ProductSKU): Observable<any> {
        return this.http.post(PRODUCT_SKU_URL, productSKU);
    }

    public getProductTags(id: number): Observable<ProductTag[]> {
        return this.http.get<ProductTag[]>(PRODUCT_URL + '/tags/' + id);
    }

    public saveProductTag(productTag: ProductTag): Observable<any> {
        return this.http.post(PRODUCT_URL + '/tags', productTag);
    }

    public deleteProductTag(id: number, productId: number): Observable<any> {
        const httpParams = new HttpParams().set('productId', String(productId));
        const options = { params: httpParams };

        return this.http.delete(PRODUCT_URL + '/tags/' + id, options);
    }
}
