import { Node, Edge } from 'reactflow';
import { MusicNode } from '../types/musicNode';
import { Music } from '../types/music';
import { DEFAULT_NODE_COLOR } from '../constants/style';

export function convertMusicNodeToReactFlowNode(musicNode: MusicNode, musics: Record<number, Music>, color: string = DEFAULT_NODE_COLOR): Node {
  return { id: musicNode.id.toString(), position: musicNode.position, data: { label: musics[musicNode.musicId].name }, type: 'custom', style: { background: color, borderColor: color } };
}

export function convertMusicNodesToReactFlowObjects(musicNodes: Record<number, MusicNode>, musics: Record<number, Music>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { result, roots } = grouping(musicNodes);
  const colorMap = coloring(result, roots);

  Object.values(musicNodes).forEach(({ id, position, musicId, next }) => {
    nodes.push(convertMusicNodeToReactFlowNode({ id, position, musicId, next }, musics, colorMap[id]));
    if (next) {
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

  const dfs = ({ id, next }: MusicNode, depth: number) => {
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
    return (result[id].group = dfs(result[next], depth + 1));
  };

  for (const id in musicNodes) {
    dfs(musicNodes[id], 1);
  }

  return { result, roots };
}

function coloring(musicNodes: Record<number, GroupedMusicNode>, roots: number[]) {
  let color = DEFAULT_NODE_COLOR;
  let groupSize = 2147483647;

  const result: Record<number, string> = {};

  const getGroupSize = (root: number) => {
    let result = 0;

    const dfs = (node: number, depth: number) => {
      result = Math.max(result, depth);
      musicNodes[node].prev.forEach((p) => {
        dfs(p, depth + 1);
      });
    };

    dfs(root, 1);

    return result;
  };

  const dfs = ({ id, prev }: GroupedMusicNode, depth: number) => {
    if (result[id]) return;
    result[id] = whitening(color, 0.55 * (depth / groupSize));
    prev.forEach((p) => dfs(musicNodes[p], depth + 1));
  };

  const cycleDfs = ({ id, prev }: GroupedMusicNode) => {
    if (result[id]) return;
    result[id] = color;
    prev.forEach((p) => cycleDfs(musicNodes[p]));
  };

  for (const id of roots) {
    color = generateRandomHexColor();
    if (musicNodes[id].cycle) {
      cycleDfs(musicNodes[id]);
    } else {
      groupSize = getGroupSize(id);
      dfs(musicNodes[id], 1);
    }
  }

  return result;
}

function generateRandomInt(min: number, max: number) {
  return Math.ceil(min) + Math.floor(Math.random() * (max - min));
}

function generateRandomHexColor() {
  return `#${Array.from({ length: 3 })
    .map(() => generateRandomInt(145, 255).toString(16))
    .join('')}`;
}

function whitening(color: string, ratio: number) {
  const rgb = colorToRgb(color);
  const newRgb = rgb.map((c) => Math.round(c + (255 - c) * ratio));
  return rgbToColor(newRgb);
}

function colorToRgb(color: string) {
  const hex = color.slice(1);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function rgbToColor(rgbArr: number[]) {
  return `#${rgbArr.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
