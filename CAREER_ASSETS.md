# Career Assets

## CV bullet

Built an n8n-based AI Operations KPI Analyst that processes multi-location SLA data, calculates and validates KPI gaps, integrates with a local Llama 3.2 model through LM Studio's OpenAI-compatible API, and generates management-ready operational reports.

## Interview explanation

I built an AI Operations KPI Analyst to connect my operations background with automation and AI. The workflow starts with SLA data for five locations and calculates the gap between actual performance and the 90% target. I used deterministic JavaScript logic to identify the highest-priority issue, because a language model should not own a critical KPI calculation. The verified facts are sent through an HTTP Request node to a local Llama 3.2 model running in LM Studio. The model converts those facts into a concise management report, returned as a clean `ai_management_report` JSON field.

## STAR result

The workflow correctly identified Dubai as the priority location, with an SLA of 66.6% and a 23.4-point gap below target, then generated a management report with supported comparisons, practical actions, and a clear single-period data limitation.
