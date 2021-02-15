import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ProductService, ProductSKU, ProductTag} from '../../../shared/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {CategoryService} from '../../../shared/services/category.service';
import {CustomValidator} from './CustomValidator';
import {HttpEventType} from '@angular/common/http';
import {UploadFileService} from '../../../shared/services/upload.service';

interface TagModel {
    display: string;
    value: number;
    readonly: boolean;
}

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {

    public productForm: FormGroup;
    public editMode = false;
    public busy = false;
    public serverLoading = false;
    public inputFileName = './assets/img/image_placeholder.jpg';
    public imageError = false;
    selectedFiles: FileList;
    currentFileUpload: File;
    public tags: ProductTag[];
    public tagModel: TagModel[];
    public id: string;
    private subscription: Subscription;
    private product: ProductSKU;
    private tagSubscription: Subscription;
    public saveAndNext = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private productService: ProductService,
        private categoryService: CategoryService,
        private uploadService: UploadFileService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.categoryService.loadAssignableCategories();
        this.id = this.route.snapshot.paramMap.get('id');

        if (this.id) {
            this.editMode = true;
            this.tagSubscription = this.productService.getProductTags(+this.id).subscribe(tags => {
                this.tags = tags;
                this.tagModel = tags.map(el => {
                    return {
                        display: el.tagName,
                        value: el.id,
                        readonly: false
                    };
                });

            });

            this.busy = true;
        }

        this.createForm();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.tagSubscription) {
            this.tagSubscription.unsubscribe();
        }
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        if (this.imageError) {
            return this.notificationService.error('Invalid Image Type Please select either of JPG, JPEG or PNG');
        }

        const name: string = form.value.name;
        const brand: string = form.value.brand;
        const categoryId: number = form.value.category;
        const description: string = form.value.description;
        const uom: string = form.value.uom;
        const price: number = form.value.price;
        const discount: number = form.value.discount;
        const nNew: boolean = form.value.new;
        const sale: boolean = form.value.sale;
        const quantity: number = form.value.quantity;
        const code: string = form.value.code;
        const discontinued = form.value.discontinued;
        const vatExclusive = form.value.taxes;

        this.serverLoading = true;

        // We are only saving Product Name Only Not changing the picture
        if (!this.selectedFiles && this.editMode) {
            return this.productService.updateProductSKU(+this.id, {
                productId: null,
                category: null,
                name, brand, categoryId,
                bundles: [
                    {
                        id: this.product.bundles[0].id,
                        sku: code,
                        price, discount, quantity, description, discontinued, vatExclusive,
                        isNew: nNew,
                        onSale: sale,
                        imagePath: [
                            this.product.bundles[0].imagePath[0]
                        ],
                        variantOptions: [{
                            id: this.product.bundles[0].variantOptions[0].id,
                            variantName: 'Unit',
                            variantOption: uom
                        }]
                    }
                ]
            }).pipe(
                catchError(err => this.handleError(err)),
                finalize(() => this.serverLoading = false)
            ).subscribe(() => this.handleSuccess());
        }

        this.currentFileUpload = this.selectedFiles.item(0);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {

            if (event.type === HttpEventType.Response) {

                this.serverLoading = true;
                if (this.editMode) {
                    return this.productService.updateProductSKU(+this.id, {
                        productId: null,
                        category: null,
                        name, brand, categoryId,
                        bundles: [
                            {
                                id: this.product.bundles[0].id,
                                sku: code,
                                price, discount, quantity, description, discontinued, vatExclusive,
                                isNew: nNew,
                                onSale: sale,
                                imagePath: [
                                    event.body as string
                                ],
                                variantOptions: [{
                                    id: this.product.bundles[0].variantOptions[0].id,
                                    variantName: 'Unit',
                                    variantOption: uom
                                }]
                            }
                        ]
                    }).pipe(
                        catchError(err => this.handleError(err)),
                        finalize(() => this.serverLoading = false)
                    ).subscribe(() => this.handleSuccess());
                } else {
                    return this.productService.saveProductSKU({
                        productId: null,
                        category: null,
                        name, brand, categoryId,
                        bundles: [
                            {
                                id: null,
                                sku: code,
                                price, discount, quantity, description, discontinued, vatExclusive,
                                isNew: nNew,
                                onSale: sale,
                                imagePath: [
                                    event.body as string
                                ],
                                variantOptions: [{
                                    id: null,
                                    variantName: 'Unit',
                                    variantOption: uom
                                }]
                            }
                        ]
                    }).pipe(
                        catchError(err => this.handleError(err)),
                        finalize(() => this.serverLoading = false)
                    ).subscribe(() => this.handleSuccess());
                }
            }

            this.selectedFiles = undefined;
        });
    }

    onFileChange(event) {

        this.selectedFiles = event.target.files;

        if (!(this.selectedFiles[0].type === 'image/jpg' || this.selectedFiles[0].type === 'image/jpeg' || this.selectedFiles[0].type === 'image/png')) {
            return this.imageError = true;
        }

        this.imageError = false;
    }

    private createForm() {
        if (this.editMode) {
            this.subscription = this.productService.getProductSKUById(+this.id).pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                })
            ).subscribe(product => {

                if (product === null) {
                    this.notificationService.error('Error Loading Product from the database, please contact support');
                    return this.router.navigate(['/admin/products/products']);
                }
                this.busy = false;
                this.product = product;
                this.inputFileName = product.bundles[0].imagePath[0];

                this.productForm = this.fb.group({
                    name: [product.name, Validators.required],
                    brand: [product.brand, Validators.required],
                    description: [product.bundles[0].description, Validators.required],
                    category: [product.categoryId, Validators.required],
                    uom: [product.bundles[0].variantOptions[0].variantOption, Validators.required],
                    price: [product.bundles[0].price, [Validators.required, CustomValidator.numeric]],
                    discount: [product.bundles[0].discount, [Validators.required, CustomValidator.numeric]],
                    new: [product.bundles[0].isNew, Validators.required],
                    sale: [product.bundles[0].onSale, Validators.required],
                    discontinued: [product.bundles[0].discontinued, Validators.required],
                    taxes: [product.bundles[0].vatExclusive, Validators.required],
                    quantity: [product.bundles[0].quantity, [Validators.required, CustomValidator.numeric]],
                    code: [product.bundles[0].sku, [Validators.required, CustomValidator.numeric]],
                    image: [null]

                });
            });
        } else {
            this.productForm = this.fb.group({
                name: [null, Validators.required],
                brand: [null, Validators.required],
                description: [null, Validators.required],
                category: [null, Validators.required],
                uom: [null, Validators.required],
                price: [null, [Validators.required]],
                discount: [null, [Validators.required]],
                new: [false, Validators.required],
                sale: [false, Validators.required],
                discontinued: [false, Validators.required],
                taxes: [false, Validators.required],
                quantity: [null, [Validators.required, CustomValidator.numeric]],
                code: [null, [Validators.required, CustomValidator.numeric]],
                image: [null, Validators.required]
            });
        }
    }

    private handleSuccess() {

        if (this.saveAndNext) {
            this.next();
        } else {
            this.router.navigate(['/admin/products/products']);
        }

        this.notificationService.success('The Product has been saved successfully');
    }

    private handleError(err) {
        // this.serverLoading = false;
        this.notificationService.error(err.error.message);
        return throwError(err);
    }

    onItemRemoved($event) {
        if (!isNaN(parseInt($event.value, 10))) {
            this.productService.deleteProductTag(+$event.value, +this.id).pipe().subscribe();
        }
    }

    onItemAdded($event) {
        this.productService.saveProductTag({
            productId: +this.id,
            id: null,
            tagName: $event.display
        }).pipe().subscribe();
    }

    previous() {
        if (+this.id === 1) {
            return this.notificationService.info('You cannot go any further');
        }

        const productId: number = +this.id - 1;

        this.router.navigateByUrl('/', {skipLocationChange: true})
            .then(() => this.router.navigate(['/admin/products/productform/' + productId]));
    }

    next() {
        const productId: number = +this.id + 1;

        this.router.navigateByUrl('/', {skipLocationChange: true})
            .then(() => this.router.navigate(['/admin/products/productform/' + productId]));
    }

    saveNext(form: FormGroup) {
        this.saveAndNext = true;
        this.onSubmit(form);
        this.next();
    }
}
