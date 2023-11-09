import { Handle, Position } from 'reactflow';
import { useAppSelector } from '../../features/store';
import { HANDLE_STYLE } from '../../constants/style';
import React from 'react';

interface CustomNodeProps {
  id: string;
  data: any;
}

export const CustomNode = React.memo(function CustomNode({ id, data }: CustomNodeProps) {
  const { isConnecting } = useAppSelector((state) => state.ui);

  return (
    <>
      <Handle type="target" position={Position.Top} style={!isConnecting ? HANDLE_STYLE : {}} isConnectableStart={false} />
      <div className="customNode">{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={isConnecting ? HANDLE_STYLE : {}} />
    </>
  );
});
