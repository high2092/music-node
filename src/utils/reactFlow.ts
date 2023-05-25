import { Node } from 'reactflow';
import { MusicNode } from '../types/musicNode';

export function convertMusicNodeToReactFlowNode(musicNode: MusicNode): Node {
  return { id: musicNode.id.toString(), position: musicNode.position, data: { label: musicNode.name } };
}
