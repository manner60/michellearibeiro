# Warm-Up Scenario Examples

## Scenario 1: Day 5, Just Starting

**Input:**
- warmup_day: 5
- current_daily_volume: 10
- open_rate: 25%
- reply_rate: 2%
- bounce_rate: 2%
- spam_complaints: 0

**Analysis:**
- Open rate (25%) is below 35% threshold
- Action: HOLD
- Next volume: 10 (no increase)

**Reasoning:** Early warm-up with below-threshold engagement. Stabilize before scaling.

---

## Scenario 2: Day 12, Strong Performance

**Input:**
- warmup_day: 12
- current_daily_volume: 25
- open_rate: 45%
- reply_rate: 12%
- bounce_rate: 0.8%
- spam_complaints: 0

**Analysis:**
- Phase limit: 5 (Day ≤14)
- 20% cap: 25 × 0.20 = 5
- Allowed increase: MIN(5, 5) = 5
- All metrics positive
- Action: SCALE
- Next volume: 25 + 5 = 30

**Reasoning:** Strong engagement across all metrics. Safe to increase by 5.

---

## Scenario 3: Day 18, One Inbox Struggling

**Input (Inbox 1):**
- warmup_day: 18
- current_daily_volume: 80
- open_rate: 15%
- bounce_rate: 4%
- spam_complaints: 0

**Input (Inbox 2):**
- warmup_day: 18
- current_daily_volume: 80
- open_rate: 42%
- bounce_rate: 1.5%
- spam_complaints: 0

**Analysis:**
- Inbox 1: HOLD (low open rate, elevated bounce)
- Inbox 2: SCALE (strong metrics)
- Next volume Inbox 1: 80
- Next volume Inbox 2: 80 + 10 = 90

**Reasoning:** Isolate poor performers. Don't let one bad inbox drag down the others.

---

## Scenario 4: Day 25, Spam Complaint

**Input:**
- warmup_day: 25
- current_daily_volume: 150
- open_rate: 38%
- reply_rate: 6%
- bounce_rate: 1.2%
- spam_complaints: 1

**Analysis:**
- Critical failure: spam_complaints > 0
- Action: FREEZE
- Next volume: 150

**Reasoning:** Any spam complaint triggers immediate freeze. Investigate cause before resuming.

---

## Scenario 5: Weekend Cold List

**Input:**
- warmup_day: 14
- current_daily_volume: 50
- open_rate: 40%
- reply_rate: 8%
- bounce_rate: 1%
- spam_complaints: 0
- day_of_week: "Sat"
- list_type: "cold"

**Analysis:**
- Phase limit: 5
- 20% cap: 50 × 0.20 = 10
- Allowed increase: MIN(5, 10) = 5
- Base next volume: 50 + 5 = 55
- Weekend throttle: 55 × 0.8 = 44
- Action: WEEKEND THROTTLE

**Reasoning:** Cold lists perform poorly on weekends. Reduce volume to maintain metrics.

---

## Scenario 6: Reply Rate Momentum

**Input:**
- warmup_day: 20
- current_daily_volume: 100
- open_rate: 45%
- reply_rate: 15% (was 8%, 10%, now 15% over 3 days)
- bounce_rate: 0.5%
- spam_complaints: 0

**Analysis:**
- Phase limit: 15 (Day >21? No, Day 20 = 10)
- Actually Day 20: max_increase = 10
- 20% cap: 100 × 0.20 = 20
- Base allowed: MIN(10, 20) = 10
- Momentum boost: 10 × 1.25 = 12.5 → 12
- Action: SCALE
- Next volume: 100 + 12 = 112

**Reasoning:** Rising reply rate indicates strong offer-audience fit. Accelerate scaling.

---

## Scenario 7: Sudden Drop Detection

**Day 1-2:**
- open_rate: 48% → 46%

**Day 3:**
- open_rate: 35%

**Analysis:**
- Drop: 46% → 35% = 11% decrease over 48 hours
- Threshold: >10% drop detected
- Action: STABILIZE
- Next volume: Same as yesterday
- Hold: 2 days before next increase

**Reasoning:** Sudden engagement drops indicate fatigue or deliverability issues. Stabilize before continuing.

---

## Emergency: Hard Reduce Trigger

**Input:**
- warmup_day: 30
- current_daily_volume: 200
- open_rate: 20%
- bounce_rate: 7%
- spam_complaints: 3

**Analysis:**
- spam_complaints (3) >= 2 → HARD REDUCE
- bounce_rate (7%) > 6% → HARD REDUCE
- Next volume: 200 × 0.5 = 100

**Reasoning:** Multiple severe reputation risks. Cut volume in half immediately and investigate.
