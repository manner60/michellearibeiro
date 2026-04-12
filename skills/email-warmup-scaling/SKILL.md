---
name: Email Warm-Up & Autonomous Scaling Engine
slug: email-warmup-scaling
author: Michelle Ribeiro / OpenClaw Community
source: https://github.com/openclaw/skills/email-warmup-scaling
description: Intelligently manage email warm-up, inbox placement optimization, and multi-inbox scaling while protecting sender reputation and maximizing deliverability. Calculates safe daily volumes based on warm-up day, engagement metrics, and risk tolerance. Supports cold and warm list types with automatic throttling and emergency failsafes.
version: 1.0.0
---

# Email Warm-Up & Autonomous Scaling Engine

## Purpose

Intelligently manage email warm-up, inbox placement optimization, and multi-inbox scaling while protecting sender reputation and maximizing deliverability.

## When to Use

✅ **USE this skill when:**
- Starting a new cold email campaign
- Scaling email volume across multiple inboxes
- Managing warm-up phases for new domains/IPs
- Automating daily send volume calculations
- Protecting sender reputation during scaling

❌ **DON'T use this skill when:**
- Sending to highly engaged warm lists (use simple scheduling instead)
- Running one-time broadcasts (no warm-up needed)
- Working with purchased lists without verification
- Ignoring platform-specific sending limits

## Input Variables

### Core Metrics (Required)
- `warmup_day` (integer) — Current day of warm-up sequence
- `current_daily_volume` (integer) — Yesterday's sent volume
- `open_rate` (percentage) — Last 24-48 hour open rate
- `reply_rate` (percentage) — Last 24-48 hour reply rate
- `bounce_rate` (percentage) — Last 24-48 hour bounce rate
- `spam_complaints` (integer) — Count in last 24-48 hours

### Advanced Metrics (Optional)
- `inbox_placement_rate` (percentage) — Deliverability metric
- `positive_reply_rate` (percentage) — Quality engagement metric
- `unsubscribe_rate` (percentage) — List health metric

### System Variables
- `number_of_inboxes` (integer) — Total sending inboxes
- `list_type` ("cold" | "warm") — Audience temperature
- `day_of_week` ("Mon"–"Sun") — For weekend throttling

## Core Objective

Scale email volume safely while:
- Maintaining strong inbox placement
- Avoiding spam flags and reputation damage
- Dynamically adjusting based on engagement signals
- Coordinating volume across multiple inboxes

## Global Rules

1. **One send per inbox per day** — Never stack multiple sends
2. **Consistency is mandatory** — No skipped days during warm-up
3. **Never scale aggressively without validation** — Metrics drive decisions
4. **Protect domain reputation above all else** — When in doubt, hold
5. **When in doubt → HOLD or REDUCE**

## Daily Scaling Logic

### Phase-Based Increase Limits

```
IF warmup_day <= 14:
  max_increase_per_inbox = 5

ELSE IF warmup_day BETWEEN 15 AND 21:
  max_increase_per_inbox = 10

ELSE:
  max_increase_per_inbox = 15
```

### 20% Rule (Hard Cap)

```
max_allowed_increase = current_daily_volume * 0.20
allowed_increase = MIN(max_increase_per_inbox, max_allowed_increase)
```

## Performance Validation Layer

### Critical Failure Conditions

| Condition | Action | Next Volume | Flag |
|-----------|--------|-------------|------|
| spam_complaints > 0 | FREEZE | current_daily_volume | "Spam complaint detected" |
| bounce_rate > 5% | EMERGENCY REDUCE | current_daily_volume * 0.7 | "High bounce rate" |

### Moderate Risk Conditions

| Condition | Action | Next Volume | Flag |
|-----------|--------|-------------|------|
| open_rate < 35% OR bounce_rate > 3% | HOLD | current_daily_volume | "Engagement below threshold" |

### Inbox Placement Control (If Available)

| Condition | Action | Next Volume | Flag |
|-----------|--------|-------------|------|
| inbox_placement_rate < 70% | HOLD | current_daily_volume | "Poor inbox placement" |
| inbox_placement_rate < 60% | REDUCE | current_daily_volume * 0.8 | "Critical inbox placement issue" |

## Positive Scaling Conditions

```
IF:
  open_rate >= 35%
  bounce_rate <= 3%
  spam_complaints == 0
  AND (if available) inbox_placement_rate >= 70%

THEN:
  ACTION = "SCALE"
  next_daily_volume = current_daily_volume + allowed_increase
```

## Engagement Momentum Boost

```
IF reply_rate increasing over 3 days:
  allowed_increase = allowed_increase * 1.25
  (still respecting 20% cap)
```

## Day-of-Week Logic

```
IF day_of_week IN ("Sat", "Sun"):

  IF list_type == "cold":
    next_daily_volume = current_daily_volume * 0.8
    ACTION = "WEEKEND THROTTLE"

  IF list_type == "warm":
    ACTION = "NORMAL SEND"
```

## Multi-Inbox Scaling Logic

```
total_system_volume = next_daily_volume * number_of_inboxes
```

**Rules:**
- Keep volume evenly distributed across inboxes
- Do NOT scale one inbox faster than others
- If one inbox shows poor metrics → isolate and reduce only that inbox

## List-Type Adaptation

### Cold Lists
- Prioritize open_rate and reply_rate heavily
- Require stricter thresholds before scaling
- Use 35% open rate threshold

### Warm Lists
- Allow slightly faster scaling
- Open rate threshold can drop to 30%
- More tolerance for variance

## Drop Detection Logic

```
IF open_rate drops by >10% over 48 hours:
  ACTION = "STABILIZE"
  next_daily_volume = current_daily_volume
  HOLD for 2 days before next increase
```

## Sending Consistency Rules

- Send at same time daily (+/- 1 hour)
- No batching during warm-up
- No sudden spikes
- Maintain consistent messaging style

## Reputation Protection Failsafe

```
IF:
  spam_complaints >= 2 OR
  bounce_rate > 6%

THEN:
  ACTION = "HARD REDUCE"
  next_daily_volume = current_daily_volume * 0.5
  FLAG = "Severe reputation risk"
```

## Output Format

Return JSON:

```json
{
  "next_daily_volume_per_inbox": 40,
  "total_system_volume": 120,
  "action_taken": "SCALE",
  "reasoning": "Strong engagement and safe inbox placement",
  "risk_flag": "NONE",
  "allowed_increase": 5,
  "current_metrics": {
    "open_rate": 42,
    "reply_rate": 8,
    "bounce_rate": 1.2,
    "spam_complaints": 0
  }
}
```

## Example Calculations

### Example 1: Day 10, Cold List, Strong Metrics

**Input:**
- warmup_day: 10
- current_daily_volume: 30
- open_rate: 42%
- reply_rate: 8%
- bounce_rate: 1.2%
- spam_complaints: 0
- number_of_inboxes: 1

**Calculation:**
- Phase limit: 5 (Day ≤14)
- 20% cap: 30 * 0.20 = 6
- Allowed increase: MIN(5, 6) = 5
- Action: SCALE (all metrics positive)
- Next volume: 30 + 5 = 35

**Output:**
```json
{
  "next_daily_volume_per_inbox": 35,
  "total_system_volume": 35,
  "action_taken": "SCALE",
  "reasoning": "Day 10 warm-up, strong engagement (42% open, 8% reply), no complaints",
  "risk_flag": "NONE"
}
```

### Example 2: Day 15, Spam Complaint Detected

**Input:**
- warmup_day: 15
- current_daily_volume: 50
- spam_complaints: 1

**Calculation:**
- Critical failure: spam_complaints > 0
- Action: FREEZE

**Output:**
```json
{
  "next_daily_volume_per_inbox": 50,
  "total_system_volume": 50,
  "action_taken": "FREEZE",
  "reasoning": "Spam complaint detected - holding volume to investigate",
  "risk_flag": "Spam complaint detected"
}
```

## Critical Reminders

- **NEVER** exceed planned volume without explicit approval
- **ALWAYS** confirm parameters before acting on live campaigns
- **PROTECT** domain reputation above speed or convenience
- **WHEN IN DOUBT** → HOLD or REDUCE

## References

- See `references/warmup-examples.md` for detailed scenario walkthroughs
- See `scripts/calculate_volume.py` for implementation

## Version History

- 1.0.0 — Initial release with core warm-up logic and safety rules
