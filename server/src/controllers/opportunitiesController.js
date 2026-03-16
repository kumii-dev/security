import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function list(req, res, next) {
  try {
    const data = await kumii.listOpportunities(req.query, token(req));
    return res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
  try {
    const data = await kumii.getOpportunity(req.params.id, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const data = await kumii.createOpportunity(req.body, token(req));
    return res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const data = await kumii.updateOpportunity(req.params.id, req.body, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
