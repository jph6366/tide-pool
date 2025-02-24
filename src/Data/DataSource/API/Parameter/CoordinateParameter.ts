import { type } from 'arktype';

// Define Latitude and Longitude using 'narrow' for custom constraints
const Latitude = type('number').narrow((value:any , ctx:any ) => {
  if (value >= -90 && value <= 90) {
    return true;  // Valid latitude
  }
  return ctx.mustBe('between -90 and 90');  // Custom error message
});

const Longitude = type('number').narrow((value:any , ctx:any )=> {
  if (value >= -180 && value <= 180) {
    return true;  // Valid longitude
  }
  return ctx.mustBe('between -180 and 180');  // Custom error message
});

// Define a Coordinate type using the latitude and longitude
const Coordinate = type({
  latitude: Latitude,
  longitude: Longitude
}); 

// TypeScript types derived from ArkType definitions
type Latitude = typeof Latitude.infer;
type Longitude = typeof Longitude.infer;
export type Coordinate = typeof Coordinate.infer;



