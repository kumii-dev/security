import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function list(req, res, next) {
  try {
    const data = await kumii.listInvestors(req.query, token(req));
    return res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
  try {
    const data = await kumii.getInvestor(req.params.id, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getActivity(req, res, next) {
  try {
    const data = await kumii.getInvestorActivity(req.params.id, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
