import { XYPosition } from 'reactflow';

export interface MusicNode {
  id: number;
  name: string;
  videoId: string;
  next: number;

  position: XYPosition;
}
