# AI Operations KPI Analyst

An n8n workflow that transforms operational SLA data into a validated, AI-generated management report.

## What it does

The workflow processes SLA performance for five locations, calculates each gap against the 90% target, identifies the priority issue deterministically, and sends verified facts to a local Llama 3.2 model through LM Studio.

```text
KPI data → SLA calculations → IF decision → management summary
         → verified priority → LM Studio → ai_management_report
```

## Technology

- n8n 2.34.6
- JavaScript Code nodes
- HTTP Request node
- LM Studio local OpenAI-compatible API
- Llama 3.2 3B Instruct
- JSON and API expressions

## Validated result

Dubai is the highest-priority location:

- SLA: **66.6%**
- Target: **90%**
- Gap: **23.4 percentage points below target**

The final workflow output is a clean `ai_management_report` field containing the main issue, priority location, supported comparisons, practical actions, and a data limitation.

## Why the design is reliable

Critical KPI calculations are performed deterministically in n8n. The AI model is used for explanation and management-language generation rather than for ranking the locations itself. This reduces the risk of an incorrect AI calculation being presented as an operational fact.

## Local AI setup

LM Studio serves the model through:

```text
http://127.0.0.1:1234/v1/chat/completions
```

The prototype requires no paid AI API key.

## Limitations and next steps

The current input is a single-period sample. It does not establish trends or explain root causes. Future versions will read the GulfFix CSV directly, add historical and repeat-visit data, and deliver reports through email or a dashboard.

## Portfolio story

> I built an AI-powered operations analytics workflow in n8n that processes KPI data, validates the highest-priority issue deterministically, sends verified facts to a local language model through an OpenAI-compatible API, and returns a management-ready report.

