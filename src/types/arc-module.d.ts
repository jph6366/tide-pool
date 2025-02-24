// arc.d.ts
declare module 'arc' {
    export interface Point {
      x: number;
      y: number;
    }
  
    export interface ArcOptions {
      offset?: number;
    }
  
    export interface ArcResult {
      json(): any; // Replace `any` with a specific type if you know the structure of the JSON output
    }
  
    export class GreatCircle {
      constructor(start: Point, end: Point);
      Arc(steps: number, options?: ArcOptions): ArcResult;
    }
  }
  