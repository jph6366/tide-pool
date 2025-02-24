
import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import arc from 'arc';
import { atom } from 'jotai';


export const profileAtom = atom<any>(
  {
  }
);

function coordinatesEqual(x: any[], y: any[]) {
    return x[0] === y[0] && x[1] === y[1];
  }

const GMRTPolylineToolMode: DrawCustomMode = MapboxDraw.modes[MapboxDraw.constants.modes.DRAW_LINE_STRING]

    GMRTPolylineToolMode.toDisplayFeatures = function(state:any, geojson:any, display:any) {


        const displayGeodesic = (geojson: any) => {
            const coordinates = geojson.geometry.coordinates;

            const segments = coordinates.slice(0,-1)
                .map((value: any, index: number) => [value, coordinates[index + 1]])
                .filter((pair: any[]) => !coordinatesEqual(pair[0], pair[1]));

            const geodesicSegments = segments.map((segment: any[][]) => {
                const greatCircle = new arc.GreatCircle(
                    { x: segment[0][0], y: segment[0][1] },
                    { x: segment[1][0], y: segment[1][1] }        
                );


                return greatCircle.Arc(32, {offset:90}).json();
            });

            let worldOffset = 0;
            const geodesicCoords = geodesicSegments.map((geodesicSegment: { geometry: { type: string; coordinates: any[]; }; }) => {
                if(geodesicSegment.geometry.type === MapboxDraw.constants.geojsonTypes.MULTI_LINE_STRING) {
                    const prevWorldOffset = worldOffset;
                    const nextWorldOffset = worldOffset + (geodesicSegment.geometry.coordinates[0][0][0] > geodesicSegment.geometry.coordinates[1][0][0] ? 1 : -1);
                    const geodesicCoords = [
                        ...geodesicSegment.geometry.coordinates[0].map((x: any[]) => [x[0] + prevWorldOffset * 360, x[1]]),
                        ...geodesicSegment.geometry.coordinates[1].map((x: any[]) => [x[0] + nextWorldOffset * 360, x[1]])
                    ];
                    worldOffset = nextWorldOffset;
                    return geodesicCoords;
                } else {
                    const geodesicCoords = geodesicSegment.geometry.coordinates.map((x: any[]) => [x[0] + worldOffset * 360, x[1]]);
                    return geodesicCoords;
                }
            }).flat();

            const geodesicCoordinates = geodesicCoords.filter((coord: any, index: number) => index === geodesicCoords.length -1 || !coordinatesEqual(coord, geodesicCoords[index + 1]));
            const geodesicGeojson = {
                ...geojson,
                geometry: {
                    ...geojson.geometry,
                    coordinates: geodesicCoordinates
                }
            };
            const geodesicLineString: any = [geodesicGeojson];
            geodesicLineString.forEach(display);
        }
        


        const isActiveLine = geojson.properties.id === state.line.id;
        geojson.properties.active = (isActiveLine) ? MapboxDraw.constants.activeStates.ACTIVE : MapboxDraw.constants.activeStates.INACTIVE;
        if (!isActiveLine) return displayGeodesic(geojson);
        // Only render the line if it has at least one real coordinate
        if (geojson.geometry.coordinates.length < 2) return;
        geojson.properties.meta = MapboxDraw.constants.meta.FEATURE;
        const selected = false;
        displayGeodesic(
            {
                type: MapboxDraw.constants.geojsonTypes.FEATURE,
                properties: {
                    meta: MapboxDraw.constants.meta.VERTEX,
                    parent: state.line.id,
                    // eslint-disable-next-line camelcase
                    coord_path: `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
                    active: (selected) ? MapboxDraw.constants.activeStates.ACTIVE : MapboxDraw.constants.activeStates.INACTIVE
                },
                geometry: {
                    type: MapboxDraw.constants.geojsonTypes.POINT,
                    coordinates: geojson.geometry.coordinates[state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1]
                }
            }
        );
    
        displayGeodesic(geojson);
    }

export default GMRTPolylineToolMode;