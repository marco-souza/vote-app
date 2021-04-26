import { Subject, VoteOptions } from '#/interfaces';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface SubjectItem extends Subject {
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

const addSubject = async (text: string): Promise<SubjectItem[]> => {
  await fetch('/api/subject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const subjects = await updateSubjects();
  return subjects;
};

const updateSubjects = async (): Promise<SubjectItem[]> => {
  const res = await fetch('/api/subject');
  const subjectsRaw: Subject[] = await res.json();

  return subjectsRaw.map((sub) => ({
    ...sub,
    voted: null, // check local storage
    vote: (side) =>
      fetch(`/api/subject/${sub.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: side }),
      }),
  }));
};

export default function SubjectListProvider({ children }: Props) {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const methods: SubjectListMethods = useMemo(
    () => ({
      addItem: (text) => addSubject(text).then(setSubjects),
      updateList: () => updateSubjects().then(setSubjects),
    }),
    [],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateSubjects().then(setSubjects);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SubjectListStates.Provider value={{ subjects }}>
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
