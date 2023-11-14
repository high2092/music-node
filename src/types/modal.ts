export const ModalTypes = {
  EXPORT: 'export',
  NOTICE: 'notice',
  HELP: 'help',
} as const;

export type ModalType = (typeof ModalTypes)[keyof typeof ModalTypes];

export interface PreparedModalProps {
  zIndex: number;
}
