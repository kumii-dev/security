import kumiiClient, { kumiiRequest } from '../integrations/kumiiApi.js';

/**
 * All proxy calls to the kumii.africa external API.
 * Functions accept an optional adminToken to forward in X-Admin-Token header.
 */

// ── Dashboard ──────────────────────────────────────────────────────────────
export async function getDashboardStats(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/dashboard/stats');
  return data;
}

export async function getDashboardAlerts(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/dashboard/alerts');
  return data;
}

// ── Startups ───────────────────────────────────────────────────────────────
export async function listStartups(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/startups', { params });
  return data;
}

export async function getStartup(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/startups/${id}`);
  return data;
}

export async function updateStartupStage(id, payload, adminToken) {
  const { data } = await kumiiRequest(adminToken).patch(`/admin/startups/${id}/stage`, payload);
  return data;
}

export async function getStartupInvestorMatches(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/startups/${id}/investor-matches`);
  return data;
}

// ── Applications ───────────────────────────────────────────────────────────
export async function listApplications(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/applications', { params });
  return data;
}

export async function getApplication(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/applications/${id}`);
  return data;
}

export async function updateApplicationStage(id, payload, adminToken) {
  const { data } = await kumiiRequest(adminToken).patch(`/admin/applications/${id}/stage`, payload);
  return data;
}

export async function addApplicationNote(id, payload, adminToken) {
  const { data } = await kumiiRequest(adminToken).post(`/admin/applications/${id}/notes`, payload);
  return data;
}

// ── Investors ──────────────────────────────────────────────────────────────
export async function listInvestors(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/investors', { params });
  return data;
}

export async function getInvestor(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/investors/${id}`);
  return data;
}

export async function getInvestorActivity(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/investors/${id}/activity`);
  return data;
}

// ── Opportunities ──────────────────────────────────────────────────────────
export async function listOpportunities(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/opportunities', { params });
  return data;
}

export async function getOpportunity(id, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/opportunities/${id}`);
  return data;
}

export async function createOpportunity(payload, adminToken) {
  const { data } = await kumiiRequest(adminToken).post('/admin/opportunities', payload);
  return data;
}

export async function updateOpportunity(id, payload, adminToken) {
  const { data } = await kumiiRequest(adminToken).put(`/admin/opportunities/${id}`, payload);
  return data;
}

// ── Pipeline ───────────────────────────────────────────────────────────────
export async function getPipelineSummary(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/pipeline/summary');
  return data;
}

export async function getPipelineDeals(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/pipeline/deals', { params });
  return data;
}

// ── Impact ─────────────────────────────────────────────────────────────────
export async function getImpactMetrics(params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/impact/metrics', { params });
  return data;
}

export async function getImpactTopPerformers(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/impact/top-performers');
  return data;
}

// ── Compliance ─────────────────────────────────────────────────────────────
export async function getComplianceStatus(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/compliance/status');
  return data;
}

export async function getComplianceAlerts(adminToken) {
  const { data } = await kumiiRequest(adminToken).get('/admin/compliance/alerts');
  return data;
}

// ── Reports ────────────────────────────────────────────────────────────────
export async function generateReport(type, params = {}, adminToken) {
  const { data } = await kumiiRequest(adminToken).get(`/admin/reports/${type}`, { params });
  return data;
}
