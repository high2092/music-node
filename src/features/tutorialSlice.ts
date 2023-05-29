import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const Tutorials = {
  CREATE_NODE: 1,
  PLAY: 2,
  SEARCH: 3,
} as const;

type Tutorial = (typeof Tutorials)[keyof typeof Tutorials];

interface TutorialState {
  tutorials: Record<Tutorial, boolean>;
}

const initialState: TutorialState = {
  tutorials: {
    [Tutorials.CREATE_NODE]: false,
    [Tutorials.PLAY]: false,
    [Tutorials.SEARCH]: false,
  },
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    startTutorial(state) {
      state.tutorials[1] = true;
    },

    completeTutorial(state, action: PayloadAction<Tutorial>) {
      if (!state.tutorials[action.payload]) return;

      state.tutorials[action.payload] = false;
      if (typeof state.tutorials[action.payload + 1] === 'boolean') state.tutorials[action.payload + 1] = true;
    },

    exitTutorial(state) {
      for (const tutorial in state.tutorials) {
        state.tutorials[tutorial] = false;
      }
    },
  },
});

export const { startTutorial, completeTutorial, exitTutorial } = tutorialSlice.actions;
