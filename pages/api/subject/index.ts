import { NextApiRequest, NextApiResponse } from 'next';

import { store, subjectActions, subjectsSelectors } from '@packages/store';

let UUID = 0;

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (_req.method) {
      case 'GET':
        res.status(200).json(subjectsSelectors.selectAll(store.getState()));
        break;
      case 'POST':
        const { text } = _req.body;
        store.dispatch(
          subjectActions.subjectAdded({
            id: UUID,
            text: text,
            votes: 0,
          }),
        );
        res.status(200).json({ id: UUID });
        UUID++;
        break;
      default:
        throw new Error('Not implemented yet');
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
