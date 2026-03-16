/**
 * Vercel serverless function entry point.
 * Vercel routes /api/* → this file via vercel.json rewrites.
 */
import app from '../server/src/app.js';

export default app;
