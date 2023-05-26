import { Node, Edge } from 'reactflow';
import { MusicNode } from '../types/musicNode';
import { Music } from '../types/music';

export function convertMusicNodeToReactFlowNode(musicNode: MusicNode, musics: Record<number, Music>): Node {
  return { id: musicNode.id.toString(), position: musicNode.position, data: { label: musics[musicNode.musicId].name } };
}

export function convertMusicNodesToReactFlowObjects(musicNodes: Record<number, MusicNode>, musics: Record<number, Music>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  Object.values(musicNodes).forEach(({ id, position, musicId, next }) => {
    nodes.push({ id: id.toString(), position, data: { label: musics[musicId].name } });
    if (next !== null) {
      edges.push({ id: `e${id}-${next}`, source: id.toString(), target: next.toString() });
    }
  });

  return { nodes, edges };
}
