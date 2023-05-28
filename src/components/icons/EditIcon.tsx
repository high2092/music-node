import { EDIT_ICON_SIZE } from '../../constants/style';

export function EditIcon() {
  return (
    <svg width={EDIT_ICON_SIZE} height={EDIT_ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title />
      <g id="Complete">
        <g id="edit">
          <g>
            <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </g>
    </svg>
  );
}
