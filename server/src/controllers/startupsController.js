import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function list(req, res, next) {
  try {
    const data = await kumii.listStartups(req.query, token(req));
    return res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
  try {
    const data = await kumii.getStartup(req.params.id, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateStage(req, res, next) {
  try {
    const data = await kumii.updateStartupStage(req.params.id, req.body, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getInvestorMatches(req, res, next) {
  try {
    const data = await kumii.getStartupInvestorMatches(req.params.id, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
