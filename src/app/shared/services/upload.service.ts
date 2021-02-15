import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const AWS_UPLOAD_URL = environment.base_url + '/api/v1/aws';
const PRICE_UPLOAD_URL = environment.base_url + '/api/v1/upload';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {

    constructor(private https: HttpClient) {}

    pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
        return this.pushFile(file, AWS_UPLOAD_URL + '/uploadFile');
    }

    pushFileForPriceUpdate(file: File): Observable<HttpEvent<{}>> {
        return this.pushFile(file, PRICE_UPLOAD_URL + '/price');
    }

    private pushFile(file: File, url: string): Observable<HttpEvent<{}>> {
        const data: FormData = new FormData();
        data.append('file', file);

        const newRequest = new HttpRequest('POST', url, data, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.https.request(newRequest);
    }
}
