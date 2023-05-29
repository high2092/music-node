import 'reactflow/dist/style.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState, NodePositionChange, OnConnect, addEdge, OnNodesDelete, OnEdgesDelete, MiniMap, NodeChange } from 'reactflow';
import { convertMusicNodeToReactFlowNode, convertMusicNodesToReactFlowObjects } from '../utils/reactFlow';
import { useAppDispatch, useAppSelector } from '../features/store';
import { addMusic, connectNode, createMusicNode, deleteEdges, deleteNodes, moveNode, playNode, setReactFLowInstance, setRequireReactFlowNodeFind, setRequireReactFlowRename, setRequireReactFlowUpdate } from '../features/mainSlice';
import { useEffect, useRef, useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { ReactFlowObjectTypes } from '../constants/reactFlow';
import { TOP_BAR_HEIGHT } from '../constants/style';
import { 초 } from '../constants/time';
import { Tutorials, completeTutorial } from '../features/tutorialSlice';

export function NodeManager() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, requireReactFlowUpdate, newNode, reactFlowInstance, musicSequence, musicNodeSequence, requireReactFlowRename, requireReactFlowNodeFind } = useAppSelector((state) => state.main);
  const { showMap } = useAppSelector((state) => state.ui);
  const { tutorials } = useAppSelector((state) => state.tutorial);

  const [latestClickedObjectType, setLatestClickedObjectType] = useState<string>();

  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const findTimeoutRef = useRef<NodeJS.Timeout>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!requireReactFlowUpdate) return;
    const { nodes, edges } = convertMusicNodesToReactFlowObjects(musicNodes, musics);
    setNodes(nodes);
    setEdges(edges);
    dispatch(setRequireReactFlowUpdate(false));
  }, [requireReactFlowUpdate]);

  useEffect(() => {
    if (requireReactFlowRename === null) return;

    setNodes((nodes) => {
      nodes.forEach((node) => {
        if (musicNodes[Number(node.id)].musicId === requireReactFlowRename) {
          node.data = { ...node.data, label: musics[requireReactFlowRename].name };
        }
      });
      return [...nodes];
    });

    dispatch(setRequireReactFlowRename(null));
  }, [requireReactFlowRename]);

  useEffect(() => {
    if (!requireReactFlowNodeFind) return;

    setNodes((nodes) => {
      const prev = nodes.find((node) => node.style.outline);
      if (prev) prev.style = { ...prev.style, outline: undefined };
      const curr = nodes.find((node) => node.id === requireReactFlowNodeFind.toString());
      curr.style = { ...curr.style, outline: '5px solid rgba(255, 255, 255, 0.8)' };
      return [...nodes];
    });

    clearTimeout(findTimeoutRef.current);
    findTimeoutRef.current = setTimeout(() => {
      setNodes((nodes) => {
        const curr = nodes.find((node) => node.id === requireReactFlowNodeFind.toString());
        curr.style = { ...curr.style, outline: undefined };
        return [...nodes];
      });
    }, 4 * 초);

    reactFlowInstance.fitView({ maxZoom: reactFlowInstance.getZoom(), duration: 2000, nodes: [{ id: requireReactFlowNodeFind.toString() }] });
    dispatch(setRequireReactFlowNodeFind(null));
  }, [requireReactFlowNodeFind]);

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
    } else {
      dispatch(completeTutorial(Tutorials.CREATE_NODE));
    }
    const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });
    const musicNode = { id: musicNodeSequence, musicId, position, next: null };
    dispatch(createMusicNode(musicNode));
  };

  const handleNodeDoubleClick = (e: React.MouseEvent, { id }: Node) => {
    dispatch(playNode(Number(id)));
    dispatch(completeTutorial(Tutorials.PLAY));
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
        className={tutorials[Tutorials.PLAY] ? 'tutorial' : ''}
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
      >
        {showMap && <MiniMap zoomable pannable position="top-right" style={{ top: TOP_BAR_HEIGHT }} nodeColor={(node) => node.style.color} maskColor="rgba(255, 255, 255, 0.2)" />}
      </ReactFlow>
    </div>
  );
}
