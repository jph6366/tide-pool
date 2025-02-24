import { atom, useAtom } from 'jotai';

export const drawModeAtom = atom('gmrt_polyline')


export function useDrawMode() {
    const [drawMode, setDrawMode] = useAtom(drawModeAtom);
  
    return { drawMode, setDrawMode };
  }