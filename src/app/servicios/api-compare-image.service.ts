import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCompareImageService {
  // private apiUrl = 'http://192.168.1.10:9100/api/AWS_Rekognition_FaceCompare';
  private apiUrl = 'https://g-mc.mx:8105/api/AWS_Rekognition_FaceCompare';

  constructor(private httpClient: HttpClient) { }

  compareImages(originalPicture: string, pictureToCompare: string): Observable<any> {
    const formData = new FormData();
    formData.append('originalPicture', originalPicture);
    formData.append('pictureToCompare', pictureToCompare);

    return this.httpClient.post(this.apiUrl, formData);
  }
}
