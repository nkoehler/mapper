import { Feature } from 'ol';

export interface MapLocation {
    id: number;
    longitude: number;
    latitude: number;
    title: string;
    feature: Feature;
}
