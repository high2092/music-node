import { Node, Edge } from 'reactflow';
import { MusicNode } from '../types/musicNode';

export function convertMusicNodeToReactFlowNode(musicNode: MusicNode): Node {
  return { id: musicNode.id.toString(), position: musicNode.position, data: { label: musicNode.name } };
}

export function convertMusicNodesToReactFlowObjects(musicNodes: Record<number, MusicNode>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  Object.values(musicNodes).forEach(({ id, position, name, next }) => {
    nodes.push({ id: id.toString(), position, data: { label: name } });
    if (next !== null) {
      edges.push({ id: `e${id}-${next}`, source: id.toString(), target: next.toString() });
    }
  });

  return { nodes, edges };
}
