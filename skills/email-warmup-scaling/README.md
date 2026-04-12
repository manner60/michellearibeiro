# Email Warm-Up & Scaling Engine

## Installation

1. Copy the `email-warmup-scaling` folder to your OpenClaw skills directory
2. No additional dependencies required

## Configuration

Set environment variables or pass parameters directly:

```bash
export WARMUP_DAY=10
export CURRENT_VOLUME=30
export OPEN_RATE=42
export REPLY_RATE=8
export BOUNCE_RATE=1.2
export SPAM_COMPLAINTS=0
export LIST_TYPE=cold
export NUM_INBOXES=1
```

## Usage

### Command Line

```bash
python scripts/calculate_volume.py \
  --warmup-day 10 \
  --current-volume 30 \
  --open-rate 42 \
  --reply-rate 8 \
  --bounce-rate 1.2 \
  --spam-complaints 0
```

### As a Module

```python
from scripts.calculate_volume import calculate_safe_volume

result = calculate_safe_volume(
    warmup_day=10,
    current_daily_volume=30,
    open_rate=42,
    reply_rate=8,
    bounce_rate=1.2,
    spam_complaints=0,
    list_type='cold',
    number_of_inboxes=1
)

print(f"Next volume: {result['next_daily_volume_per_inbox']}")
print(f"Action: {result['action_taken']}")
```

## Safety Notes

- This skill provides RECOMMENDATIONS — always review before scaling
- Never exceed your email platform's daily sending limits
- Monitor inbox placement rates if available
- Pause immediately if spam complaints occur

## Supported Platforms

The scaling logic is platform-agnostic. Implementations provided for:
- Global Control (tag-based workflow triggering)
- Generic API integration (customizable)

## Version History

- 1.0.0 — Initial release
