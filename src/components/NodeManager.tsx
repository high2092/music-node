import 'reactflow/dist/style.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState, NodePositionChange, OnConnect, addEdge, OnNodesDelete, OnEdgesDelete } from 'reactflow';
import { convertMusicNodeToReactFlowNode, convertMusicNodesToReactFlowObjects } from '../utils/reactFlow';
import { useAppDispatch, useAppSelector } from '../features/store';
import { addMusic, connectNode, createMusicNode, deleteEdges, deleteNodes, moveNode, playNode, setReactFLowInstance, setRequireReactFlowUpdate } from '../features/mainSlice';
import { useEffect, useRef, useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { ReactFlowObjectTypes } from '../constants/reactFlow';

export function NodeManager() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, requireReactFlowUpdate, newNode, reactFlowInstance, musicSequence, musicNodeSequence } = useAppSelector((state) => state.main);

  const [latestClickedObjectType, setLatestClickedObjectType] = useState<string>();

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!requireReactFlowUpdate) return;
    const { nodes, edges } = convertMusicNodesToReactFlowObjects(musicNodes, musics);
    setNodes(nodes);
    setEdges(edges);
    setRequireReactFlowUpdate(false);
  }, [requireReactFlowUpdate]);

  useEffect(() => {
    if (!newNode) return;
    setNodes((nodes) => nodes.concat(convertMusicNodeToReactFlowNode(newNode, musics)));
  }, [newNode]);

  const _onNodesChange = (nodesChange: NodePositionChange[]) => {
    onNodesChange(nodesChange);

    if (nodesChange[0].type !== 'position') return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const nodeMoves = nodesChange.map((nodeChange) => {
        const { id, position } = nodes.find((node) => node.id === nodeChange.id);
        return { id, position };
      });
      dispatch(moveNode(nodeMoves));
    }, 500);
  };

  const onConnect: OnConnect = (connection) => {
    if (latestClickedObjectType === ReactFlowObjectTypes.EDGE_TARGET) return;
    setEdges((eds) => {
      eds = eds.filter((edge) => edge.source !== connection.source);
      return addEdge(connection, eds);
    });
    dispatch(connectNode(connection));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY);
    if (!data) return;
    let { musicId, name, videoId } = JSON.parse(data);
    if (!musicId) {
      const music = { id: musicSequence, name, videoId };
      dispatch(addMusic(music));
      musicId = music.id;
    }
    const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });
    const musicNode = { id: musicNodeSequence, musicId, position, next: null };
    dispatch(createMusicNode(musicNode));
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, { id }: Node) => {
    dispatch(playNode(Number(id)));
  };

  const handleReactFlowMouseDownCapture = ({ target }) => {
    for (const type of Object.values(ReactFlowObjectTypes)) {
      if (target.classList.value.includes(type)) {
        setLatestClickedObjectType(type);
        return;
      }
    }
    setLatestClickedObjectType(null);
  };

  const handleNodesDelete: OnNodesDelete = (nodes: Node[]) => {
    const nodeIdList = nodes.map(({ id }) => Number(id));
    dispatch(deleteNodes(nodeIdList));
  };

  const handleEdgesDelete: OnEdgesDelete = (nodes: Edge[]) => {
    dispatch(deleteEdges(nodes.map(({ source }) => Number(source))));
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={_onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        onConnect={onConnect}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onNodeDoubleClick={handleNodeDoubleClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        onInit={(instance) => dispatch(setReactFLowInstance(instance))}
      />
    </div>
  );
}
