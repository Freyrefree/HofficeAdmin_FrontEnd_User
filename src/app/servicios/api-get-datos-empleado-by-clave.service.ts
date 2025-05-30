import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado.model';
// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiGetDatosEmpleadoByClaveService {


  constructor(private httpClient: HttpClient) { }

  getDataEmpleado(claveEmpleado: string): Observable<Empleado[]> {
    const formData = new FormData();
    formData.append('claveEmpleado', claveEmpleado);
    
    // return this.httpClient.post(this.apiUrl, formData);
    return this.httpClient.post<Empleado[]>(API_URLS.API_URL_GET_EMPLOYEE_BY_CLAVE, formData);

  }
}
