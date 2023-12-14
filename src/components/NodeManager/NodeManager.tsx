import 'reactflow/dist/style.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState, NodePositionChange, OnConnect, addEdge, OnNodesDelete, OnEdgesDelete, MiniMap, NodeChange, XYPosition } from 'reactflow';
import { convertMusicNodeToReactFlowNode, convertMusicNodesToReactFlowObjects } from '../../utils/reactFlow';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { connectNode, createMusicNode, createMusicNodeV2, deleteEdges, deleteNodes, moveNode, playNode, setReactFLowInstance, setRequireReactFlowNodeFind, setRequireReactFlowRename, setRequireReactFlowUpdate } from '../../features/mainSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../../constants/interface';
import { ReactFlowObjectTypes } from '../../constants/reactFlow';
import { TOP_BAR_HEIGHT } from '../../constants/style';
import { 초 } from '../../constants/time';
import { Tutorials, completeTutorial } from '../../features/tutorialSlice';
import { CustomNode } from '../CustomNode/CustomNode';
import { setInProgress, setIsConnecting } from '../../features/uiSlice';
import { handleUnauthorized, http, retry } from '../../utils/api';

const nodeTypes = {
  custom: CustomNode,
};

interface NodeManagerProps {
  readonly: boolean;
}

export function NodeManager({ readonly }: NodeManagerProps) {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, requireReactFlowUpdate, newNode, reactFlowInstance, musicNodeSequence, requireReactFlowRename, requireReactFlowNodeFind } = useAppSelector((state) => state.main);
  const { showMap, inProgress } = useAppSelector((state) => state.ui);

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
      if (curr) curr.style = { ...curr.style, outline: '5px solid rgba(255, 255, 255, 0.8)' };
      return [...nodes];
    });

    clearTimeout(findTimeoutRef.current);
    findTimeoutRef.current = setTimeout(() => {
      setNodes((nodes) => {
        const curr = nodes.find((node) => node.id === requireReactFlowNodeFind.toString());
        if (curr) curr.style = { ...curr.style, outline: undefined };
        return [...nodes];
      });
    }, 4 * 초);

    reactFlowInstance.fitView({ minZoom: 1, maxZoom: 1, duration: 2000, nodes: [{ id: requireReactFlowNodeFind.toString() }] });
    dispatch(setRequireReactFlowNodeFind(null));
  }, [requireReactFlowNodeFind]);

  useEffect(() => {
    if (!newNode) return;
    setNodes((nodes) => nodes.concat(convertMusicNodeToReactFlowNode(newNode, musics)));
  }, [newNode]);

  const _onNodesChange = useCallback(
    async (nodesChange: NodePositionChange[]) => {
      onNodesChange(nodesChange);

      if (readonly) return;
      if (nodesChange[0].type !== 'position') return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const nodeMoves: { id: number; position: XYPosition }[] = nodesChange.reduce((acc, cur) => {
          const node = nodes.find((node) => node.id === cur.id);
          if (!node) return acc;
          const { id, position } = node;
          return acc.concat({ id: Number(id), position });
        }, []);

        const response = await retry(() => http.post('/api/data/move-node', { nodeMoves }));

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        dispatch(moveNode(nodeMoves));
      }, 500);
    },
    [timeoutRef.current]
  );

  const onConnect: OnConnect = useCallback(
    async (connection) => {
      if (latestClickedObjectType === ReactFlowObjectTypes.EDGE_TARGET) return;
      setEdges((eds) => {
        eds = eds.filter((edge) => edge.source !== connection.source);
        return addEdge(connection, eds);
      });

      if (!readonly) {
        const response = await retry(() =>
          http.post('/api/data/connect-node', {
            source: Number(connection.source),
            target: Number(connection.target),
          })
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        } else if (response.status !== 200) return;
      }

      dispatch(connectNode(connection));
    },
    [latestClickedObjectType]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      if (inProgress) return;

      const data = e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY);
      if (!data) return;

      e.stopPropagation();
      dispatch(setInProgress(true));

      try {
        const { musicId, name, videoId } = JSON.parse(data);
        const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });

        if (readonly) {
          dispatch(createMusicNode({ musicId, position }));
        } else {
          const response = await retry(() => http.post('/api/data/music-node', { musicId, name, videoId, position }));
          if (response.status === 401) {
            handleUnauthorized();
            return;
          }

          const { music, musicNode } = await response.json();
          dispatch(createMusicNodeV2({ music, musicNode }));
        }
      } finally {
        dispatch(setInProgress(false));
      }
    },
    [reactFlowInstance, inProgress]
  );

  const handleNodeClick = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const handleNodeDoubleClick = useCallback((e: React.MouseEvent, { id }: Node) => {
    clearTimeout(timeoutRef.current);
    dispatch(playNode(Number(id)));
    dispatch(completeTutorial(Tutorials.PLAY));
  }, []);

  const handleReactFlowMouseDownCapture = useCallback(({ target }) => {
    for (const type of Object.values(ReactFlowObjectTypes)) {
      if (target.classList.value.includes(type)) {
        setLatestClickedObjectType(type);
        if (type === 'source') {
          dispatch(setIsConnecting(true));
        }
        return;
      }
    }
    setLatestClickedObjectType(null);
  }, []);

  const handleReactFlowMouseUpCapture = useCallback(() => {
    dispatch(setIsConnecting(false));
  }, []);

  const handleNodesDelete: OnNodesDelete = useCallback(async (nodes: Node[]) => {
    const nodeIdList = nodes.map(({ id }) => Number(id));

    if (!readonly) {
      const response = await retry(() => http.post('/api/data/delete-node', { nodes: nodeIdList }));
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
    }

    dispatch(deleteNodes(nodeIdList));
  }, []);

  const handleEdgesDelete: OnEdgesDelete = useCallback(async (nodes: Edge[]) => {
    const sources = nodes.map(({ source }) => Number(source));

    if (!readonly) {
      const response = await retry(() => http.post('/api/data/disconnect-node', { sources }));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      } else if (response.status !== 200) return;
    }

    dispatch(deleteEdges(sources));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={_onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        onConnect={onConnect}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        onMouseUpCapture={handleReactFlowMouseUpCapture}
        onInit={(instance) => dispatch(setReactFLowInstance(instance))}
      >
        {showMap && <MiniMap zoomable pannable position="top-right" style={{ top: TOP_BAR_HEIGHT }} nodeColor={(node) => node.style.color} maskColor="rgba(255, 255, 255, 0.2)" />}
      </ReactFlow>
    </div>
  );
}
