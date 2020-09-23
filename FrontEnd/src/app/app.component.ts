import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Feature, Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import ScaleLine from 'ol/control/ScaleLine';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
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
import { EditLocationDialogComponent } from './components/edit-location-dialog/edit-location-dialog.component';
import { MapLocation } from './data/interfaces';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  latitude: number = 43.466667;
  longitude: number = -80.516670;

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

    this.pointSource = new VectorSource({
      loader: () => this.getLocations()
    });

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
    event.preventDefault();

    const coordinate = this.map.getEventCoordinate(event);

    this.dialog.open(AddLocationDialogComponent).afterClosed().subscribe({
      next: (title: string) => {
        if (title) {
          this.addLocation(coordinate, title);
        }
      }
    });
  }

  addLocation(coordinate: Coordinate, title: string): void {
    const longitude = +coordinate[0].toFixed(9);
    const latitude = +coordinate[1].toFixed(9);

    this.apiService.addLocation(title, longitude, latitude).subscribe({
      next: data => {
        const feature = new Feature();
        feature.setGeometry(this.getGeometry(coordinate));
        feature.setStyle(this.getStyle(title));

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
      error: () => alert('Unable to add location!')
    });
  }

  deleteLocation(location: MapLocation) {
    this.apiService.deleteLocation(location.id).subscribe({
      next: () => {
        const index = this.locations.findIndex(x => x.id === location.id);
        this.locations.splice(index, 1);
        this.pointSource.removeFeature(location.feature);
      },
      error: () => alert('Unable to delete location!')
    });
  }

  handleEditLocation(location: MapLocation) {
    this.dialog.open(EditLocationDialogComponent, { data: location.title }).afterClosed().subscribe({
      next: (title: string) => {
        if (title) {
          this.editLocation(location, title);
        }
      }
    });
  }

  editLocation(location: MapLocation, title: string) {
    this.apiService.editLocation(location.id, title).subscribe({
      next: () => {
        const index = this.locations.indexOf(location);
        this.locations[index].title = title;
        this.locations[index].feature.setStyle(this.getStyle(title));
      },
      error: () => alert('Unable to edit location!')
    });
  }

  moveToLocation(location: MapLocation): void {
    const coordinate: Coordinate = [location.longitude, location.latitude];
    const view = this.map.getView();
    view.setZoom(15);
    view.setCenter(coordinate);
  }

  private getLocations(): void {
    this.apiService.getLocations().subscribe({
      next: locations => {
        this.locations = locations.map(x => {
          const coordinate: Coordinate = [x.longitude, x.latitude];

          const feature = new Feature();
          feature.setGeometry(this.getGeometry(coordinate));
          feature.setStyle(this.getStyle(x.title));

          const location: MapLocation = {
            id: x.id,
            title: x.title,
            longitude: x.longitude,
            latitude: x.latitude,
            feature: feature
          };

          return location;
        });

        this.pointSource.addFeatures(this.locations.map(x => x.feature));
      },
      error: () => alert('Unable to load locations!')
    });
  }

  private getGeometry(coordinate: Coordinate): Geometry {
    return new Point(coordinate);
  }

  private getStyle(title: string): Style {
    return new Style({
      stroke: new Stroke({ color: '#673ab7' }),
      fill: new Fill({ color: '#673ab7' }),
      text: new Text({
        font: 'bold 18px "Open Sans"',
        placement: 'point',
        fill: new Fill({ color: 'white' }),
        text: title,
        padding: [5, 5, 5, 5],
        backgroundFill: new Fill({ color: '#673ab7' }),
      })
    });
  }
}
