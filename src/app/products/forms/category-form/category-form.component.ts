import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, CategoryService} from '../../../shared/services/category.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UploadFileService} from '../../../shared/services/upload.service';
import {HttpEventType} from '@angular/common/http';
import {MatSelectionListChange} from '@angular/material/list';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, OnDestroy {
    public categoryForm: FormGroup;
    public editMode = false;
    public inputFileName = './assets/img/image_placeholder.jpg';
    public busy = false;
    public imageError = false;
    public serverLoading = false;
    selectedFiles: FileList;
    currentFileUpload: File;
    file: string;
    private id: string;
    private subscription: Subscription;
    private subSubCategory: Subscription;
    public category: Category;
    public otherCategories: Category[];
    @ViewChild('right') moveRight: ElementRef;
    @ViewChild('left') moveLeft: ElementRef;
    private left: string;
    private right: string;
    public showSubCategory = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadService: UploadFileService,
        private categoryService: CategoryService,
        private notificationService: NotificationService) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

        if (this.id) {
            this.editMode = true;
            this.busy = true;

            this.categoryService.getCategoryProductCount(+this.id).pipe(
                catchError(err => this.handleError(err))
            ).subscribe(count => {

                console.log('COUNT', count.id);

                // Additional Check required to ensure that empty child category cannot have subcategories
                if (count.id === 0) {
                    this.showSubCategory = true;
                    this.subSubCategory = this.categoryService.getAvailableCategoriesForSubCategorization(+this.id)
                        .pipe(
                            catchError(err => this.handleError(err))
                        )
                        .subscribe(categories => this.otherCategories = categories);
                }
            });
        }

        this.createForm();
    }

    ngOnDestroy() {
        this.clearSubscriptions();
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (this.imageError) {
            return this.notificationService.error('Invalid Image Type Please select either of JPG, JPEG or PNG');
        }

        const name = form.value.name;
        this.serverLoading = true;

        // We are only saving Product Name Only Not changing the picture
        if (!this.selectedFiles && this.editMode) {
            return this.categoryService.updateCategory(+this.id, {
                id: null,
                name: name, image_url: this.category.image_url, subCategories: null
            }).pipe(
                catchError(err => this.handleError(err))
            ).subscribe(() => this.handleSuccess());
        }

        this.currentFileUpload = this.selectedFiles.item(0);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {

            // if (event.type === HttpEventType.DownloadProgress) {
            //     console.log('Download Progress', event);
            // }

            if (event.type === HttpEventType.Response) {
                if (this.editMode) {
                    this.categoryService.updateCategory(+this.id, {
                        id: null,
                        name: name, image_url: event.body as string, subCategories: null
                    }).pipe(
                        catchError(err => this.handleError(err))
                    ).subscribe(() => this.handleSuccess());
                } else {
                    this.categoryService.saveCategory({
                        id: null,
                        name: name, image_url: event.body as string, subCategories: null
                    }).pipe(
                        catchError(err => this.handleError(err))
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

    private handleSuccess() {
        this.serverLoading = false;
        this.router.navigate(['/admin/products/productcategories']);
        this.notificationService.success('The Category has been saved successfully');
    }

    private handleError(err) {
        this.notificationService.error(err.message);
        this.serverLoading = false;
        return throwError(err);
    }

    private createForm() {
        if (this.editMode) {
            this.subscription = this.categoryService.getCategoryById(+this.id).pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                })
            ).subscribe(category => {
                this.busy = false;
                this.inputFileName = category.image_url;
                this.category = category;

                this.categoryForm = this.fb.group({
                    name: [category.name, Validators.required],
                    image: [null]
                });
            });
        } else {
            this.categoryForm = this.fb.group({
                name: [null, Validators.required],
                image: [null, Validators.required]
            });
        }
    }

    onSelectSubCategory($event: MatSelectionListChange) {
        this.left = $event.source._value[0];
        this.moveRight.nativeElement.disabled = false;
        this.moveLeft.nativeElement.disabled = true;
    }

    onSelectOtherCategory($event: MatSelectionListChange) {
        this.right = $event.source._value[0];
        this.moveRight.nativeElement.disabled = true;
        this.moveLeft.nativeElement.disabled = false;

    }

    onMoveRight() {
        if (this.left) {
            this.serverLoading = true;
            this.categoryService.removeSubCategory(+this.left).pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }),
                tap(() => this.reload())
            ).subscribe(() => this.serverLoading = false);
        }
    }

    onMoveLeft() {
        if (this.right) {
            this.serverLoading = true;
            this.categoryService.addSubCategory(+this.right, +this.id).pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }),
                tap(() => this.reload())
            ).subscribe(() => this.serverLoading = false);
        }
    }

    private reload() {

        this.clearSubscriptions();

        if (this.showSubCategory) {
            this.subSubCategory = this.categoryService.getAvailableCategoriesForSubCategorization(+this.id)
                .pipe(
                    catchError(err => this.handleError(err))
                )
                .subscribe(categories => this.otherCategories = categories);
        }

        this.subscription = this.categoryService.getCategoryById(+this.id).pipe(
            catchError(err => {
                console.log(err);
                return throwError(err);
            })
        ).subscribe(category => {
            this.category = category;
        });
    }

    private clearSubscriptions() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (this.subSubCategory) {
            this.subSubCategory.unsubscribe();
        }
    }
}
