import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MapLocationDto } from '../data/dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API = '';

  constructor(
    private http: HttpClient
  ) { }

  getLocations(): Observable<MapLocationDto[]> {
    return this.http.get<MapLocationDto[]>(this.API + 'get');
  }

  addLocation(name: string, longitude: number, latitude: number): Observable<MapLocationDto> {
    return this.http.post<MapLocationDto>(this.API + 'add?name=' + name + '&longitude=' + longitude + '&latitude=' + latitude, location);
  }

  deleteLocation(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.API + 'delete?id=' + id);
  }

  editLocation(id: number, name: string): Observable<boolean> {
    return this.http.post<boolean>(this.API + 'edit?id=' + id, name);
  }
}
