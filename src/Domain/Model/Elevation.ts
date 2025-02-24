import { Feature, Point, LineString } from 'geojson';

export interface ElevationPoint extends Feature<Point> {
    properties: {
        name?: string;
    };
}

export interface ElevationProfile extends Feature<LineString> {
    properties: {
        name?: string;
    };
}

// geojson-shave