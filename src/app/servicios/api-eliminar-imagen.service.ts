import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiEliminarImagenService {


  constructor(private httpClient: HttpClient) { }

  eliminarImagen(path: string): Observable<any> {
    const formData = new FormData();
    formData.append('path', path);
    return this.httpClient.post(API_URLS.API_URL_DELETE_IMAGE, formData);
  }
}
