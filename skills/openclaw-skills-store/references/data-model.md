# Data Model

Use structured product data for all storefront rendering.

## Example product object

```json
{
  "id": "asana-productivity",
  "name": "Asana Productivity",
  "slug": "asana-productivity",
  "short_description": "Manage and automate Asana workflows.",
  "full_description": "Full Open Claw integration with Asana.",
  "categories": ["Productivity", "Automation"],
  "tags": ["asana", "tasks"],
  "icon": "📋",
  "features": ["API Integration", "Automation Support"],
  "difficulty": "Beginner",
  "pricing_type": "one_time",
  "price": 49,
  "sale_price": null,
  "currency": "USD",
  "is_free": false,
  "install_available": true,
  "install_options": [
    { "name": "Guided Setup", "price": 99 },
    { "name": "Done-For-You Install", "price": 297 }
  ],
  "download_url": "",
  "checkout_url": "/checkout/asana-productivity",
  "details_url": "/skills/asana-productivity",
  "version": "1.0",
  "last_updated": "2026-03-29",
  "license": "Single Site",
  "compatibility": ["Open Claw", "API-enabled workflows"],
  "faq": [
    {
      "question": "Does this require technical setup?",
      "answer": "Basic self-install is included, but guided and done-for-you options are available."
    }
  ]
}
```

## Required fields

- id
- name
- slug
- short_description
- categories
- features
- pricing_type
- price or is_free
- install_available
- version
- last_updated

## Notes

- Do not hardcode cards in the UI; render from data.
- Paid products must not expose raw paid file URLs publicly.
- Free products may use direct download URLs or email-gated flows depending on store settings.
- Install options should be nested with clear pricing.
