import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiGetDatosFotografiaBaseService {

  // private apiUrl = 'http://192.168.1.14:8000/api/obtenerFoto/';
  private apiUrl = 'https://g-mc.mx:8003/api/obtenerFoto/';

  constructor(private httpClient: HttpClient) { }

  getPathImage(rfc: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}${rfc}`;
    return this.httpClient.get<{ message: string }>(url);
  }
}
