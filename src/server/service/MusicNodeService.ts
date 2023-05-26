import { XYPosition } from 'reactflow';
import { MusicNode } from '../../types/musicNode';
import { musicNodeRepository } from '../repository/MusicNodeRepository';

interface NodeMove {
  id: number;
  position: XYPosition;
}

class MusicNodeService {
  createMusicNode(musicId: number, position: XYPosition) {
    const musicNode: MusicNode = { musicId, position, next: null };
    musicNodeRepository.save(musicNode);
    return musicNode;
  }

  deleteMusicNodes(nodes: number[]) {
    nodes.forEach((id) => {
      musicNodeRepository.deleteById(id);
    });
  }

  moveNode(nodeMoves: NodeMove[]) {
    nodeMoves.forEach(({ id, position }) => {
      const musicNode = musicNodeRepository.findById(id);
      if (!musicNode) return;
      musicNode.position = position;
    });
  }
}

export const musicNodeService = new MusicNodeService();