import { Handle, Position } from 'reactflow';
import { useAppSelector } from '../../features/store';
import React from 'react';
import { handle } from './CustomNode.css';

interface CustomNodeProps {
  id: string;
  data: any;
}

export const CustomNode = React.memo(function CustomNode({ id, data }: CustomNodeProps) {
  const { isConnecting } = useAppSelector((state) => state.ui);

  return (
    <>
      <Handle type="target" position={Position.Top} className={handle({ disabled: !isConnecting })} isConnectableStart={false} />
      <div className="customNode">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className={handle({ disabled: isConnecting })} />
    </>
  );
});
