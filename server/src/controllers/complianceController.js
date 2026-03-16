import * as kumii from '../services/kumiiApiService.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function getStatus(req, res, next) {
  try {
    const data = await kumii.getComplianceStatus(token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getAlerts(req, res, next) {
  try {
    const data = await kumii.getComplianceAlerts(token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
