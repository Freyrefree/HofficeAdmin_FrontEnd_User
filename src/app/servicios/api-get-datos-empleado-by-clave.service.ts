import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class ApiGetDatosEmpleadoByClaveService {

  // private apiUrl = 'http://192.168.1.10:9100/api/EmpleadosByClaveNomina';
  // private apiUrl = 'https://192.168.1.10:9102/api/EmpleadosByClaveNomina';
  private apiUrl = 'https://g-mc.mx:8105/api/EmpleadosByClaveNomina';
  




  constructor(private httpClient: HttpClient) { }

  getDataEmpleado(claveEmpleado: string): Observable<Empleado[]> {
    const formData = new FormData();
    formData.append('claveEmpleado', claveEmpleado);
    
    // return this.httpClient.post(this.apiUrl, formData);
    return this.httpClient.post<Empleado[]>(this.apiUrl, formData);

  }
}
