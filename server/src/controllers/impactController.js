import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function getMetrics(req, res, next) {
  try {
    const data = await kumii.getImpactMetrics(req.query, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getTopPerformers(req, res, next) {
  try {
    const data = await kumii.getImpactTopPerformers(token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
