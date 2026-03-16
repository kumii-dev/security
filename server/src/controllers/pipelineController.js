import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function getSummary(req, res, next) {
  try {
    const data = await kumii.getPipelineSummary(token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getDeals(req, res, next) {
  try {
    const data = await kumii.getPipelineDeals(req.query, token(req));
    return res.json({ success: true, ...data });
  } catch (err) { next(err); }
}
