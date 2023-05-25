import 'reactflow/dist/style.css';
import ReactFlow, { Node, useNodesState, useEdgesState, NodePositionChange, OnConnect, addEdge } from 'reactflow';
import { musicNodeService } from '../server/MusicNodeService';
import { convertMusicNodeToReactFlowNode, convertMusicNodesToReactFlowObjects } from '../utils/reactFlow';
import { useAppDispatch, useAppSelector } from '../features/store';
import { connectNode, createMusicNode, moveNode, setRequireReactFlowUpdate } from '../features/mainSlice';
import { useEffect, useRef } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';

export function NodeManager() {
  const dispatch = useAppDispatch();
  const { musicNodes, requireReactFlowUpdate } = useAppSelector((state) => state.main);

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!requireReactFlowUpdate) return;
    const { nodes, edges } = convertMusicNodesToReactFlowObjects(musicNodes);
    setNodes(nodes);
    setEdges(edges);
    setRequireReactFlowUpdate(false);
  }, [requireReactFlowUpdate]);

  const _onNodesChange = (nodesChange: NodePositionChange[]) => {
    onNodesChange(nodesChange);

    if (nodesChange[0].type !== 'position') return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const nodeMoves = nodesChange.map((nodeChange) => {
        const { id, position } = nodes.find((node) => node.id === nodeChange.id);
        return { id, position };
      });
      dispatch(moveNode(nodeMoves));
    }, 500);
  };

  const onConnect: OnConnect = (connection) => {
    setEdges((eds) => addEdge(connection, eds));
    dispatch(connectNode(connection));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const { name, videoId } = JSON.parse(e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY));
    const musicNode = musicNodeService.createMusicNode(name, videoId);
    setNodes((nodes) => nodes.concat(convertMusicNodeToReactFlowNode(musicNode)));
    dispatch(createMusicNode(musicNode));
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, { id }: Node) => {
    console.log(musicNodes[Number(id)].videoId);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={_onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onNodeDoubleClick={handleNodeDoubleClick} />
    </div>
  );
}
