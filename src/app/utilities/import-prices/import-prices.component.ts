import {Component, OnDestroy, OnInit} from '@angular/core';
import {UploadFileService} from '../../shared/services/upload.service';
import {NotificationService} from '../../shared/services/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpEventType} from '@angular/common/http';

@Component({
    selector: 'app-import-prices',
    templateUrl: './import-prices.component.html',
})
export class ImportPricesComponent implements OnInit, OnDestroy {
    busy = false;
    public selectedFile: File;

    constructor(
        private uploadService: UploadFileService,
        private notificationService: NotificationService,
    ) {}

    ngOnDestroy(): void {}

    ngOnInit(): void {}


    changeListener(event) {
        this.selectedFile = event.target.files[0];
        console.log(this.selectedFile.name);
    }

    onSubmit() {
        if (!this.selectedFile) {
            return this.notificationService.error('Please select a CSV file to upload');
        }

        this.busy = true;
        this.uploadService.pushFileForPriceUpdate(this.selectedFile).pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe(event => {
            if (event.type === HttpEventType.Response) {
                this.notificationService.success('Prices have been updated accordingly');
                this.selectedFile = undefined;
            }
        });
    }

    private handleError(err) {
        console.log(err);
        this.notificationService.error(err.error);
        return throwError(err);
    }
}
