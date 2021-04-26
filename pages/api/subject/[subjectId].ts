import { NextApiRequest, NextApiResponse } from 'next';

import { store, subjectActions, subjectsSelectors } from '@packages/store';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const { subjectId } = _req.query;
  const { vote } = _req.body;
  if (Array.isArray(subjectId)) throw new TypeError('id must be a string!');

  try {
    switch (_req.method) {
      case 'GET':
        res
          .status(200)
          .json(subjectsSelectors.selectById(store.getState(), subjectId));
        break;
      case 'POST':
        store.dispatch(
          subjectActions.voteSubject({
            id: Number(subjectId),
            side: vote,
          }),
        );
        res.status(200).json({ subjectId });
        break;
      default:
        throw new Error('Not implemented yet');
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
