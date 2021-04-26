import {
  createEntityAdapter,
  createSlice,
  configureStore,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Subject, VoteOptions } from '#/interfaces';

const subjectsAdapter = createEntityAdapter<Subject>({
  // Assume IDs are stored in a field other than `subject.id`
  selectId: (subject) => subject.id,
  // Keep the "all IDs" array sorted based on subject titles
  sortComparer: (a, b) => b.votes - a.votes, // desc
});

interface VoteSubjectPayload {
  id: number;
  side: VoteOptions;
}

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: subjectsAdapter.getInitialState(),
  reducers: {
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `subjectAdded` action type / creator
    subjectAdded: subjectsAdapter.addOne,
    voteSubject(state, action: PayloadAction<VoteSubjectPayload>) {
      // Or, call them as "mutating" helpers in a case reducer
      const { selectAll } = subjectsAdapter.getSelectors();
      const voteIncr = action.payload.side === 'down' ? -1 : 1;
      console.log(voteIncr);
      const newSubjects = selectAll(state).map((sub) => ({
        ...sub,
        votes: sub.id === action.payload.id ? sub.votes + voteIncr : sub.votes,
      }));
      subjectsAdapter.setAll(state, newSubjects);
    },
  },
});

export const store = configureStore({
  reducer: {
    subjects: subjectSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

export const subjectsSelectors = subjectsAdapter.getSelectors<RootState>(
  (state) => state.subjects,
);

export const subjectActions = subjectSlice.actions;
