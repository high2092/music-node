import { XYPosition } from 'reactflow';

export interface MusicNode {
  id: number;
  musicId: number;
  next?: number;

  position: XYPosition;
}
