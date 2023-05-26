import { Node, Edge } from 'reactflow';
import { MusicNode } from '../types/musicNode';
import { Music } from '../types/music';

export function convertMusicNodeToReactFlowNode(musicNode: MusicNode, musics: Record<number, Music>): Node {
  return { id: musicNode.id.toString(), position: musicNode.position, data: { label: musics[musicNode.musicId].name } };
}

export function convertMusicNodesToReactFlowObjects(musicNodes: Record<number, MusicNode>, musics: Record<number, Music>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { result, roots } = grouping(musicNodes);
  const colorMap = coloring(result, roots);

  Object.values(musicNodes).forEach(({ id, position, musicId, next }) => {
    nodes.push({ id: id.toString(), position, data: { label: musics[musicId].name }, style: { background: colorMap[id] } });
    if (next !== null) {
      edges.push({ id: `e${id}-${next}`, source: id.toString(), target: next.toString() });
    }
  });

  return { nodes, edges };
}

interface GroupedMusicNode extends MusicNode {
  visited: boolean;
  prev: number[];
  cycle: boolean;
  group: number;
}

function grouping(musicNodes: Record<number, MusicNode>) {
  const result: Record<number, GroupedMusicNode> = {};
  Object.values(musicNodes).forEach((musicNode) => {
    result[musicNode.id] = { ...musicNode, visited: false, prev: [], cycle: false, group: null };
  });

  const roots: number[] = [];
  let seq = 1;

  const dfs = ({ id, next }: MusicNode) => {
    if (result[id].visited) {
      if (result[id].group === null) {
        result[id].group = seq++;
        result[id].cycle = true;
        roots.push(id);
      }
      return result[id].group;
    }
    result[id].visited = true;

    if (!next) {
      roots.push(id);
      return (result[id].group = seq++);
    }

    result[next].prev.push(id);
    return (result[id].group = dfs(result[next]));
  };

  for (const id in musicNodes) {
    dfs(musicNodes[id]);
  }

  return { result, roots };
}

function coloring(musicNodes: Record<number, GroupedMusicNode>, roots: number[]) {
  let color = 'black';

  const result: Record<number, string> = {};
  Object.values(musicNodes).forEach((musicNode) => {
    result[musicNode.id] = color;
  });

  const dfs = ({ id, prev }: GroupedMusicNode) => {
    result[id] = color;
    if (musicNodes[id].cycle) return;
    prev.forEach((p) => dfs(musicNodes[p]));
  };

  for (const id of roots) {
    color = generateRandomHexColor();
    dfs(musicNodes[id]);
  }

  return result;
}

function generateRandomHexColor() {
  const R = Math.floor(Math.random() * 127 + 128).toString(16);
  const G = Math.floor(Math.random() * 127 + 128).toString(16);
  const B = Math.floor(Math.random() * 127 + 128).toString(16);
  return `#${[R, G, B].join('')}`;
}
