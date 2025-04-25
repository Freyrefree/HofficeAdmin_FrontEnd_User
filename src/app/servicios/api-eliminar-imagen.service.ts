import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiEliminarImagenService {

  // private apiUrl = 'http://192.168.1.14:8102/api/EliminarImagen'; // URL actualizada de la API
  private apiUrl = 'https://g-mc.mx:8102/api/EliminarImagen';

  constructor(private httpClient: HttpClient) { }

  eliminarImagen(path: string): Observable<any> {
    const formData = new FormData();
    formData.append('path', path);
    return this.httpClient.post(this.apiUrl, formData);
  }
}
