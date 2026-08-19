// n8n Code node
// Mode: Run Once for Each Item
// Place after the LM Studio HTTP Request node.

const rawReport = $json.choices?.[0]?.message?.content || '';
const sourceData = $('Aggregate GulfFix KPIs').first().json;
const priority = sourceData.priority || {};
const overall = sourceData.overall || {};

const cleanText = value => String(value ?? '')
  .replace(/\\n/g, '\n')
  .replace(/\\r/g, '')
  .trim();

return {
  json: {
    report_title: 'GulfFix Operations Improvement Report',
    source: sourceData.source,
    period: sourceData.period,
    completed_jobs: overall.jobs,
    total_revenue_aed: overall.revenue_aed,
    overall_sla_pct: overall.sla_pct,
    overall_sla_gap_points: overall.sla_gap_points,
    average_csat: overall.csat,
    repeat_visit_pct: overall.repeat_visit_pct,
    priority_location: priority.location,
    priority_sla_pct: priority.sla_pct,
    priority_sla_gap_points: priority.sla_gap_points,
    management_summary: cleanText(sourceData.management_summary),
    ai_management_report: cleanText(rawReport),
  },
};
