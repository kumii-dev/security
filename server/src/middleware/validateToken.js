import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

/**
 * Verifies a Microsoft Entra ID (Azure AD) issued id_token / access_token.
 * Validates signature via JWKS, audience, issuer, and tenant.
 */

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${config.azure.tenantId}/discovery/v2.0/keys`,
  cache: true,
  cacheMaxAge: 86400000, // 24 h
  rateLimit: true,
});

function getSigningKey(header) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

/**
 * validateToken(req, res, next)
 * Expects:  Authorization: Bearer <microsoft_id_token>
 * Populates: req.msIdentity = decoded token claims
 */
export async function validateToken(req, res, next) {
  try {
    // Accept token from Authorization header OR from request body (login endpoint)
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.body?.idToken) {
      token = req.body.idToken;
    } else {
      return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'Bearer token required.' } });
    }

    // Decode header to extract kid without full verification (needed for JWKS lookup)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded?.header?.kid) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Malformed token.' } });
    }

    const signingKey = await getSigningKey(decoded.header);

    const verified = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      audience: config.azure.clientId,
      issuer: `https://login.microsoftonline.com/${config.azure.tenantId}/v2.0`,
    });

    // Enforce tenant
    if (verified.tid && verified.tid !== config.azure.tenantId) {
      logger.warn({ event: 'invalid_tenant', tid: verified.tid, requestId: req.id });
      return res.status(401).json({ success: false, error: { code: 'INVALID_TENANT', message: 'Token tenant mismatch.' } });
    }

    req.msIdentity = verified;
    next();
  } catch (err) {
    logger.warn({ event: 'token_validation_failed', error: err.message, requestId: req.id });
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token validation failed.' } });
  }
}
