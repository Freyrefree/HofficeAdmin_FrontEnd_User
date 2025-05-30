import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiCompareImageService {

  constructor(private httpClient: HttpClient) { }

  compareImages(originalPicture: string, pictureToCompare: string): Observable<any> {
    const formData = new FormData();
    formData.append('originalPicture', originalPicture);
    formData.append('pictureToCompare', pictureToCompare);

    return this.httpClient.post(API_URLS.API_URL_FACE_COMPARE, formData);
  }
}
