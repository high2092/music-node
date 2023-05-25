import { MusicNode } from '../types/musicNode';

class MusicNodeService {
  sequence: number;

  constructor() {
    this.sequence = 1;
  }

  createMusicNode(name: string, videoId: string): MusicNode {
    return { id: this.sequence++, name, videoId, position: { x: 0, y: this.sequence * 50 }, next: null };
  }
}

export const musicNodeService = new MusicNodeService();
