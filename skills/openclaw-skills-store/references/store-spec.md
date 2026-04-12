# Open Claw Skills Store Spec

## Purpose

Build a modern, premium Open Claw Skills Store where users can:
- browse skills by category
- search and filter skills
- download free skills
- purchase paid skills
- request installation/setup services

This is a single-owner storefront, not a multi-vendor marketplace.

## Store model

The website is a branded digital storefront for Open Claw skills.

It must support:
- Free skills
- Paid skills
- Skill bundles (optional)
- Installation/setup services
- Optional support packages

## Core pages

### Homepage
Include:
- hero section with headline + search bar
- featured skills
- free starter skills
- most popular skills
- install / setup services section
- beginner-friendly section
- CTA: Browse Skills / Get Setup Help

### Shop / Skills Library Page
Include:
- search bar
- sort dropdown
- left sidebar filters
- responsive card grid
- pagination or lazy loading

### Skill Detail Page
Include:
- title
- icon / image
- categories
- tags
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
- FAQ section
- CTA buttons

### Freebies Page (optional but recommended)
Include:
- all free skills in one place
- lead generation support
- optional email gate

### Install / Services Page
Include:
- guided setup
- done-for-you install
- custom setup
- monthly support (optional)

### My Downloads (future-ready)
Include:
- purchased skills
- free downloads (optional)
- re-download access
- support links

## Visual design requirements

- dark navy background
- rounded cards
- subtle borders and glow
- clean spacing
- modern sans-serif font
- bright blue CTA buttons
- premium SaaS look

## Search and filtering

Support:
- keyword search
- category filtering
- free vs paid filter
- install available filter
- difficulty filter (optional)
- tag filtering (optional)

Sorting options:
- Name (A–Z)
- Newest
- Most Popular
- Price Low → High
- Price High → Low

## Category system

Skills must support multiple categories.
Display categories in a sidebar with checkboxes and dynamic counts.
Allow multi-select filtering.

Example categories:
- AI & Content
- Automation
- CRM & Sales
- Email Marketing
- Cloud & Deploy
- Database & Backend
- Communication
- Design & Media
- E-commerce
- Productivity

## Free vs paid product rules

### Free products
- clearly labeled as Free
- may be direct download or email-gated
- can be used for lead generation

### Paid products
- require completed checkout before access
- must not expose public file links
- must display price, included features, license, and requirements

## Installation and service upsells

Each skill may include:
- self-install
- guided setup
- done-for-you install
- custom setup

These must show:
- scope
- pricing
- turnaround time
- request custom quote option if needed

## Pricing structure

Support:
- free
- one-time purchase
- optional bundles
- install add-ons

Each product should include:
- price
- optional sale price
- currency
- pricing label

## Payment integration (future-ready)

Prepare for:
- Stripe
- Lemon Squeezy
- ThriveCart
- Gumroad

Use checkout_url for paid items and download_url for free items.

## UX enhancements

Recommended:
- Beginner Friendly badges
- Popular tags
- New labels
- Best for Agencies grouping
- Install help banner

## Acceptance criteria

The final build must:
1. look like a premium SaaS storefront
2. support free and paid skills
3. include category filtering with counts
4. include search and sorting
5. include install upsells
6. be fully data-driven
7. be scalable
8. protect paid content
9. be easy to navigate
10. be ready for real monetization

## Critical instruction

Do not:
- build a basic list
- use a light theme
- hardcode repeated cards
- expose paid file URLs

Do:
- prioritize UX
- maintain clean structure
- design for scalability
- ensure professional quality
