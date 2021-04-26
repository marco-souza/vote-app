// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export interface Submittable {
  onSubmit?: () => void;
}

export type VoteOptions = null | 'up' | 'down';

export interface Subject {
  id: number;
  text: string;
  votes: number;
}
