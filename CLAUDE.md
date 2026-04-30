# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Goal

AI-powered Resume Optimization Platform. Primary success metric: **increase shortlist rate** — not resume aesthetics, not generic advice.

Every feature decision filters through:
1. Will this improve shortlist chances?
2. Is this actionable and specific?
3. Is this personalized (not generic)?

If NO to any → do not build.

## Target Users

Freshers, early professionals (0–5 years), career switchers. User intent: "Help me get shortlisted."

## System Architecture

Three layers:

| Layer | Responsibility |
|---|---|
| **Input** | Resume parsing (PDF/DOCX → text), optional JD |
| **Intelligence** | ATS scoring, domain optimization, skill gap analysis, rewriting |
| **Output** | Improved resume, structured feedback, template recommendation |

Backend is a single FastAPI service (`backend/`). See `backend/CLAUDE.md` for full request flow, dev commands, and Claude integration details.

## Core User Flow

Upload Resume → Select Target Role → Receive (analysis + ATS score + improved version + skill gaps) → Download optimized resume

Future scope — do NOT build yet: JD matching engine, application tracking, feedback loops from real applications, learning recommendations.

## Product Philosophy

Resume is NOT the product → Outcome (shortlist) is the product.

Focus on: Impact | Clarity | Relevance

## Key Capabilities

- Resume parsing (messy → structured)
- Impact rewriting (responsibilities → measurable achievements)
- Role-specific optimization
- ATS scoring
- Skill gap detection

## Output Standards

Every AI output must be structured, actionable, and personalized — referencing actual resume content, not generic templates.

Every response must include:
- Clear issues (what's wrong and why)
- Exact fixes (not vague direction)
- Improved version (show, don't just tell)

## Edge Case Rules

| Situation | Approach |
|---|---|
| No experience | Lead with projects and education |
| Career switch | Highlight transferable skills using destination-domain keywords |
| Career gap | Reframe around learning or projects during the period |
| Weak resume | Rebuild rather than patch |

## What to Avoid

- Generic career advice not tied to a specific role
- Fabricated achievements or inflated metrics
- ATS-unfriendly formatting or over-design
- Cosmetic improvements that don't affect shortlist probability
- Long paragraphs in outputs

## Final Principle

Always optimize for: **"Will this help the user get shortlisted?"**
