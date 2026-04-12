---
name: Open Claw Skills Store Builder
slug: openclaw-skills-store
author: Michelle Ribeiro
description: Build a premium dark-mode storefront for selling and distributing Open Claw skills, including free downloads, paid products, bundles, and installation services. Use when creating or updating a single-owner skills storefront with category filtering, search, sorting, product detail pages, install upsells, and secure handling of paid downloads.
version: 1.0.0
---

# Open Claw Skills Store Builder

Use this skill when building a branded storefront for Open Claw skills.

## Core outcome

Build a premium, scalable skills store that supports:
- free skills
- paid skills
- optional bundles
- installation/setup services
- support packages

This is a **single-owner storefront**, not a marketplace.

## Ask for these inputs first

Before building, collect:
1. **Store name / brand**
2. **Target repo or project folder**
3. **Primary deployment target** (Vercel, static hosting, etc.)
4. **Payment method** (Stripe, Lemon Squeezy, ThriveCart, Gumroad, placeholder links)
5. **Initial product inventory** (at least 3–5 skills)
6. **Whether free downloads are direct or email-gated**
7. **Whether install/setup services should be included in V1**
8. **Whether “My Downloads” should be real or placeholder/future-ready**

## Build rules

- Use a **dark premium SaaS** look by default
- Use **structured product data**; do not hardcode repeated cards
- Do **not** expose paid file URLs publicly
- Include category filtering, search, and sorting
- Support both free and paid products
- Support install/service upsells where applicable
- Keep the architecture scalable so new skills can be added without redesigning the UI

## Minimum V1 deliverables

1. Homepage
2. Shop / Skills Library page
3. Skill detail page template
4. Install / Services page
5. Structured product data file
6. Filtering/search/sorting UI
7. Clear pricing and CTA behavior

## CTA rules

- Free product → Download
- Paid product → Buy Now
- Install option available → View Details or Add Install

## Product card requirements

Every skill card should include:
- icon or image
- title
- category
- short description
- 2–4 feature bullets
- pricing label (Free / Paid)
- optional badges
- CTA button

## Product detail page requirements

Each product page should include:
- title
- image/icon
- categories + tags
- short summary
- full description
- features list
- use cases
- compatibility
- difficulty level
- version + last updated
- pricing
- license info
- install options
- FAQ
- CTA buttons

## Data model

Use structured data for products. Read `references/data-model.md` before implementation.

## Full spec

Read `references/store-spec.md` for the complete store requirements, UX expectations, guardrails, and acceptance criteria.

## Recommended implementation

Prefer a stack that supports filtering and scalable routing cleanly, such as:
- Next.js
- static JSON or TS data source
- Vercel-friendly deployment

## Safety and business guardrails

- Paid products must require validated purchase before access
- Free products may be direct-download or email-gated, based on user choice
- Pricing and product claims must reflect actual functionality
- Installation offers must define scope and turnaround clearly
- Refund/license info should be visible on relevant pages

## Default workflow

1. Gather store inputs from the user
2. Build structured product data
3. Scaffold the storefront pages
4. Add filtering/search/sorting
5. Add install/service logic
6. Review against the acceptance criteria
7. Prepare for deployment
