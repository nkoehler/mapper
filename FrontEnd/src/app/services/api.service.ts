import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MapLocationDto } from '../data/dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API = environment.production
    ? 'https://nkoehler-mapper-api.azurewebsites.net/location/poi/'
    : 'http://localhost:8000/location/poi/';

  constructor(
    private http: HttpClient
  ) { }

  getLocations(): Observable<MapLocationDto[]> {
    return this.http.get<MapLocationDto[]>(this.API);
  }

  addLocation(title: string, longitude: number, latitude: number): Observable<MapLocationDto> {
    const request = {
      title,
      longitude,
      latitude
    };

    return this.http.post<MapLocationDto>(this.API, request);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete(this.API + id + '/');
  }

  editLocation(id: number, title: string): Observable<any> {
    const request = {
      title
    };

    return this.http.patch(this.API + id + '/', request);
  }
}
