import { Handle, Position } from 'reactflow';
import { useAppSelector } from '../../features/store';
import { HANDLE_STYLE } from '../../constants/style';

export function CustomNode({ id, data }) {
  const { isConnecting } = useAppSelector((state) => state.ui);

  return (
    <>
      <Handle type="target" position={Position.Top} style={!isConnecting ? HANDLE_STYLE : {}} isConnectableStart={false} />
      <div className="customNode">{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={isConnecting ? HANDLE_STYLE : {}} />
    </>
  );
}
