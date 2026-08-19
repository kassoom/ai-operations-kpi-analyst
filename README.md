# AI Operations KPI Analyst

An n8n workflow that transforms operational SLA data into a validated, AI-generated management report.

## What it does

The workflow reads the GulfFix Home Services job-level CSV/XLSX, keeps only completed jobs, calculates trusted KPIs by branch and service type, identifies the priority issue deterministically, and sends verified facts to a local Llama 3.2 model through LM Studio.

```text
GulfFix CSV/XLSX → completed jobs → KPI aggregation → verified priority
                 → management summary → LM Studio → ai_management_report
```

## Technology

- n8n 2.34.6
- JavaScript Code nodes
- HTTP Request node
- LM Studio local OpenAI-compatible API
- Llama 3.2 3B Instruct
- JSON and API expressions

## Validated result from the supplied dashboard data

Dubai is the highest-priority location:

- Completed jobs: **11,348**
- Total revenue: **AED 3,945,454**
- Overall SLA: **76.5%** against a **90%** target
- Dubai SLA: **66.6%**
- Dubai gap: **23.4 percentage points below target**
- Highest repeat-visit service: **Appliance Repair (7.1%)**
- Highest revenue per job: **AC Repair (AED 439.46)**

The final workflow output is a clean `ai_management_report` field containing the main issue, priority location, supported comparisons, practical actions, and a data limitation.

The final formatter also exposes the verified evidence behind the report as separate fields: completed jobs, total revenue, overall SLA, SLA gap, CSAT, repeat visits, priority location, priority SLA, and priority gap.

## Why the design is reliable

Critical KPI calculations are performed deterministically in n8n. The AI model is used for explanation and management-language generation rather than for ranking the locations itself. This reduces the risk of an incorrect AI calculation being presented as an operational fact.

## Local AI setup

LM Studio serves the model through:

```text
http://127.0.0.1:1234/v1/chat/completions
```

The prototype requires no paid AI API key.

## Limitations and next steps

The supplied GulfFix dataset is synthetic portfolio data for demonstration. It covers 1 January–30 June 2026 and does not establish long-term trends or explain root causes. The next production-style step is to schedule the workflow and deliver the report to email or a dashboard.

## Portfolio story

> I built an AI-powered operations analytics workflow in n8n that processes KPI data, validates the highest-priority issue deterministically, sends verified facts to a local language model through an OpenAI-compatible API, and returns a management-ready report.

