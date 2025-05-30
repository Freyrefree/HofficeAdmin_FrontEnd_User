import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiUploadImageService {

  constructor(private httpClient: HttpClient) { }

  uploadImage(formData: FormData): Observable<any> {
    return this.httpClient.post(API_URLS.API_URL_UPLOAD_IMAGE, formData);
  }
}
