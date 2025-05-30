import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Import the API_URLS constant if needed
import { API_URLS } from '../Config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ApiRegistrarAccesoService {


  constructor(private httpClient: HttpClient) { }

  registrarAcceso(claveEmpleado: string, formattedDateTime: string, dia: string): Observable<any> {
    const formData = new FormData();
    formData.append('ClaveEmpleado', claveEmpleado);
    formData.append('FechaHora', formattedDateTime); // Suponiendo que el campo en la API se llama 'hora'
    formData.append('Tipo', '1');
    formData.append('Descripcion', 'Acceso');
    formData.append('Dia', dia);


    return this.httpClient.post(API_URLS.API_URL_REGISTER_EMPLOYEE_ACCESS, formData);
  }
}
