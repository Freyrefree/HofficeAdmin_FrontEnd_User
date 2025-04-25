import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUploadImageService {
  // private apiUrl = 'http://192.168.1.14:8102/api/AlmacenamientoImagen'; // URL actualizada de la API
  private apiUrl = 'https://g-mc.mx:8102/api/AlmacenamientoImagen';


  constructor(private httpClient: HttpClient) { }

  uploadImage(formData: FormData): Observable<any> {
    return this.httpClient.post(this.apiUrl, formData);
  }
}
