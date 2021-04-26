import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import { store, subjectActions, subjectsSelectors } from '@packages/store';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (_req.method) {
      case 'GET':
        res.status(200).json(subjectsSelectors.selectAll(store.getState()));
        break;
      case 'POST':
        const { text } = _req.body;
        const newId = uuidv4();
        store.dispatch(
          subjectActions.subjectAdded({
            id: newId,
            text: text,
            votes: 0,
          }),
        );
        res.status(200).json({ id: newId });
        break;
      default:
        throw new Error('Not implemented yet');
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
