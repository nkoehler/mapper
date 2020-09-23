import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Feature, Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import ScaleLine from 'ol/control/ScaleLine';
import { Coordinate } from 'ol/coordinate';
import Circle from 'ol/geom/Circle';
import Point from 'ol/geom/Point';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';

import { AddLocationDialogComponent } from './components/add-location-dialog/add-location-dialog.component';
import { ApiService } from './services/api.service';
import { MapLocation } from './data/interfaces';
import { MapLocationDto } from './data/dto';
import { EditLocationDialogComponent } from './components/edit-location-dialog/edit-location-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  latitude: number = 43.466667;
  longitude: number = -80.516670;

  drag = false;

  rasterLayer: TileLayer;
  pointSource: VectorSource;
  pointLayer: VectorLayer;
  map: Map;

  locations: MapLocation[] = [];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) { }

  ngAfterViewInit(): void {
    this.rasterLayer = new TileLayer({
      source: new OSM()
    });

    this.pointSource = new VectorSource({});
    this.pointLayer = new VectorLayer({
      source: this.pointSource,
    });

    this.map = new Map({
      target: 'map',
      interactions: defaultInteractions().extend([
        new PinchZoom()
      ]),
      layers: [
        this.rasterLayer,
        this.pointLayer,
      ],
      view: new View({
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: 15
      }),
      controls: defaultControls().extend([
        new ScaleLine({
          bar: true,
          minWidth: 150
        }),
      ])
    });
  }

  handleSelectCoordinates(event: MouseEvent): void {
    if (this.drag) {
      return;
    }

    const coordinates = this.map.getEventCoordinate(event);

    this.dialog.open(AddLocationDialogComponent).afterClosed().subscribe({
      next: (name: string) => {
        if (name) {
          this.addLocation(coordinates, name);
        }
      }
    });
  }


  addLocation(coordinate: Coordinate, name: string): void {
    const feature = new Feature();
    feature.setGeometry(new Point(coordinate));
    feature.setStyle(this.getStyle(coordinate, name));

    // REMOVE
    const location: MapLocation = {
      id: null,
      title: name,
      longitude: coordinate[0],
      latitude: coordinate[1],
      feature: feature
    };
    this.pointSource.addFeature(feature);
    this.locations.push(location);
    /*
        this.apiService.addLocation(name, coordinate[0], coordinate[1]).subscribe({
          next: data => {
            const location: MapLocation = {
              id: data.id,
              title: data.title,
              longitude: data.longitude,
              latitude: data.latitude,
              feature: feature
            };
    
            this.pointSource.addFeature(location.feature);
            this.locations.push(location);
          },
          error: err => alert('Unable to add location!')
        });*/
  }

  deleteLocation(location: MapLocation) {
    this.locations.splice(this.locations.indexOf(location), 1);
    this.pointSource.removeFeature(location.feature);
    /*
        this.apiService.removeLocation(location.id).subscribe({
          next: (success) => {
            if (success) {
              this.locations.splice(this.locations.indexOf(location));
              this.pointSource.removeFeature(location.feature);
            } else {
              alert('Unable to delete location!');
            }
          },
          error: err => alert('Unable to delete location!')
        });*/
  }

  handleEditLocation(location: MapLocation) {
    this.dialog.open(EditLocationDialogComponent, { data: location.title }).afterClosed().subscribe({
      next: (name: string) => {
        if (name) {
          this.editLocation(location, name);
        }
      }
    });
  }

  editLocation(location: MapLocation, name: string) {
    const index = this.locations.indexOf(location);
    const coordinate: Coordinate = [location.longitude, location.latitude];
    this.locations[index].title = name;
    this.locations[index].feature.setStyle(this.getStyle(coordinate, name));

    /*
        this.apiService.editLocation(location.id, name).subscribe({
          next: (success) => {
            if (success) {
              const index = this.locations.indexOf(location);
              const coordinate: Coordinate = [location.longitude, location.latitude];
              this.locations[index].title = name;
              this.locations[index].feature.setStyle(this.getStyle(coordinate, name)
            } else {
              alert('Unable to edit location!');
            }
          },
          error: err => alert('Unable to edit location!')
        });*/
  }

  moveToLocation(location: MapLocation): void {
    const coordinate: Coordinate = [location.longitude, location.latitude];
    const view = this.map.getView();
    view.setZoom(15);
    view.setCenter(coordinate);
  }

  private getStyle(coordinate: Coordinate, name: string): Style {
    return new Style({
      geometry: new Circle(coordinate, 30),
      stroke: new Stroke({ color: '#673ab7' }),
      fill: new Fill({ color: '#673ab7' }),
      text: new Text({
        offsetY: 20,
        font: 'bold 18px "Open Sans"',
        placement: 'point',
        fill: new Fill({ color: 'black' }),
        text: name
      })
    });
  }
}
