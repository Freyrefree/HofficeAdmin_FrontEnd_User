import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiGetDatosFotografiaBaseService {



  constructor(private httpClient: HttpClient) { }

  getPathImage(rfc: string): Observable<{ message: string }> {
    const url = `${API_URLS.API_URL_GET_BASE_PHOTO}${rfc}`;
    return this.httpClient.get<{ message: string }>(url);
  }
}
