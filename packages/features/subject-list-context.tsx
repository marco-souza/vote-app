import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type VoteOptions = null | 'up' | 'down';

interface SubjectItem {
  text: string;
  votes: number;
  voted: VoteOptions;
  vote: (side: VoteOptions) => void;
}

interface SubjectListState {
  subjects: SubjectItem[];
}

interface SubjectListMethods {
  addItem: (item: string) => void;
  updateList: () => void;
}

const SubjectListStates = createContext<SubjectListState>({
  subjects: [],
});

const makeNotImplementedException = () => {
  throw new Error('Method is not implemented');
};

const SubjectListMethods = createContext<SubjectListMethods>({
  addItem: makeNotImplementedException,
  updateList: makeNotImplementedException,
});

interface Props {
  readonly children: ReactNode;
}

export default function SubjectListProvider({ children }: Props) {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const states: SubjectListState = {
    subjects,
  };

  const voteItem = useCallback(
    (position: number, side: VoteOptions) => {
      if (side == null) return;
      const item = subjects[position];
      if (item == null) return;

      const vote = side === 'up' ? 1 : -1;
      setSubjects(
        subjects.map((item, index) => {
          if (index !== position) return item;
          if (item.voted != null) return item;
          return {
            ...item,
            voted: side,
            votes: item.votes + vote,
          };
        }),
      );
    },
    [subjects],
  );

  const methods: SubjectListMethods = useMemo(
    () => ({
      addItem: (text) =>
        setSubjects(
          [
            {
              text,
              voted: null,
              votes: 0,
            },
            ...subjects,
          ].map(
            // Add vote function
            (item, index): SubjectItem => ({
              ...item,
              vote: (side) => voteItem(index, side),
            }),
          ),
        ),
      updateList: () => {}, // load async
    }),
    [setSubjects, subjects],
  );

  return (
    <SubjectListStates.Provider value={states}>
      <SubjectListMethods.Provider value={methods}>
        {children}
      </SubjectListMethods.Provider>
    </SubjectListStates.Provider>
  );
}

export function useSubjectListStates() {
  return useContext(SubjectListStates);
}

export function useSubjectListMethods() {
  return useContext(SubjectListMethods);
}
