// n8n Code node
// Mode: Run Once for All Items
// Input: one item per row from Spreadsheet File (CSV/XLSX)

const rows = $input.all().map(item => item.json);
const completed = rows.filter(row => String(row.Status ?? '').toLowerCase() === 'completed');

if (completed.length === 0) {
  throw new Error('No Completed GulfFix jobs were found. Check the file path and the Status column.');
}

const number = (value) => Number(value ?? 0) || 0;
const truthy = (value) => ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
const pct = (value) => Number((value * 100).toFixed(1));
const average = (items, field) => items.length
  ? items.reduce((sum, row) => sum + number(row[field]), 0) / items.length
  : 0;
const money = (value) => Number(value.toFixed(0));

const target = 90;
const overallSla = completed.filter(row => truthy(row.SLA_Met)).length / completed.length;
const overall = {
  jobs: completed.length,
  revenue_aed: money(completed.reduce((sum, row) => sum + number(row.RevenueAED), 0)),
  sla_pct: pct(overallSla),
  sla_gap_points: Number((target - pct(overallSla)).toFixed(1)),
  csat: Number(average(completed, 'CSAT').toFixed(2)),
  repeat_visit_pct: pct(completed.filter(row => truthy(row.RepeatVisit)).length / completed.length),
};

const groupBy = (field) => {
  const groups = new Map();
  for (const row of completed) {
    const key = row[field] || 'Unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.entries()].map(([name, items]) => {
    const sla = items.filter(row => truthy(row.SLA_Met)).length / items.length;
    return {
      [field === 'Branch' ? 'location' : 'service_type']: name,
      jobs: items.length,
      revenue_aed: money(items.reduce((sum, row) => sum + number(row.RevenueAED), 0)),
      revenue_per_job_aed: Number(average(items, 'RevenueAED').toFixed(2)),
      sla_pct: pct(sla),
      sla_gap_points: Number((target - pct(sla)).toFixed(1)),
      csat: Number(average(items, 'CSAT').toFixed(2)),
      repeat_visit_pct: pct(items.filter(row => truthy(row.RepeatVisit)).length / items.length),
    };
  });
};

const locations = groupBy('Branch').sort((a, b) => a.sla_pct - b.sla_pct);
const services = groupBy('ServiceType');
const priority = locations[0];
const highestRepeatService = [...services].sort((a, b) => b.repeat_visit_pct - a.repeat_visit_pct)[0];
const highestRevenueService = [...services].sort((a, b) => b.revenue_per_job_aed - a.revenue_per_job_aed)[0];
const lowestRepeatService = [...services].sort((a, b) => a.repeat_visit_pct - b.repeat_visit_pct)[0];
const bestLocation = locations[locations.length - 1];
const locationDifference = Number((bestLocation.sla_pct - priority.sla_pct).toFixed(1));
const repeatDifference = Number((highestRepeatService.repeat_visit_pct - lowestRepeatService.repeat_visit_pct).toFixed(1));

const locationLines = locations
  .map(row => `${row.location}: SLA ${row.sla_pct}% — ${row.sla_gap_points} points below target`)
  .join('\n');

const management_summary = [
  `GulfFix completed ${overall.jobs.toLocaleString()} jobs and generated AED ${overall.revenue_aed.toLocaleString()} revenue.`,
  `Overall SLA is ${overall.sla_pct}% against a ${target}% target (${overall.sla_gap_points} points below target).`,
  `Priority location: ${priority.location} at ${priority.sla_pct}% SLA (${priority.sla_gap_points} points below target).`,
  `Highest repeat-visit service: ${highestRepeatService.service_type} at ${highestRepeatService.repeat_visit_pct}%.`,
  `Highest revenue per job: ${highestRevenueService.service_type} at AED ${highestRevenueService.revenue_per_job_aed}.`,
].join('\n');

const analysis_prompt = `Act as a practical operations manager and report formatter.

Use ONLY the approved facts below. Do not calculate new figures and do not introduce any other location, service, average, or percentage.

Write a concise management report with exactly these headings:
1. Main issue
2. Priority location and SLA gap
3. Two data-supported patterns
4. Three practical actions
5. One limitation

Verified overall KPIs:
${JSON.stringify(overall)}

Verified location KPIs (already sorted worst to best):
${locationLines}

Approved facts to copy exactly:
- Priority: ${priority.location}, SLA ${priority.sla_pct}%, ${priority.sla_gap_points} points below the ${target}% target.
- Best location: ${bestLocation.location}, SLA ${bestLocation.sla_pct}%.
- Difference between best and priority location: ${locationDifference} SLA points.
- Highest repeat visits: ${highestRepeatService.service_type}, ${highestRepeatService.repeat_visit_pct}%.
- Lowest repeat visits: ${lowestRepeatService.service_type}, ${lowestRepeatService.repeat_visit_pct}%.
- Difference between highest and lowest repeat visits: ${repeatDifference} percentage points.
- Highest revenue per job: ${highestRevenueService.service_type}, AED ${highestRevenueService.revenue_per_job_aed}.

Use these exact actions:
- Review Dubai's completed-job workflow and compare it with the best-performing location.
- Monitor Dubai SLA weekly against the ${target}% target.
- Investigate the repeat-visit process for ${highestRepeatService.service_type}.

Rules:
- Use only the supplied numbers.
- Do not infer causes, customer satisfaction, technician skill, or customer behavior.
- Do not say that a high or low repeat-visit rate proves satisfaction.
- Do not mention averages or figures not listed above.
- Copy the approved actions; do not invent training, marketing, pricing, or SLA changes.
- Keep the report under 220 words and finish every section.
- State that this is synthetic portfolio data in the limitation section.`;

const requestBody = {
  model: 'llama-3.2-3b-instruct',
  messages: [{ role: 'user', content: analysis_prompt }],
  temperature: 0.1,
  max_tokens: 360,
  stream: false,
};

return [{
  json: {
    source: 'GulfFix Home Services — synthetic portfolio dataset',
    period: '2026-01-01 to 2026-06-30',
    target_sla_pct: target,
    overall,
    locations,
    services,
    priority,
    management_summary,
    analysis_prompt,
    requestBody,
  },
}];
