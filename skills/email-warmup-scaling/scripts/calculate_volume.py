#!/usr/bin/env python3
"""
Email Warm-Up Volume Calculator
Implements the scaling logic from the email-warmup-scaling skill
"""

import json
import argparse
from typing import Dict, Any


def calculate_safe_volume(
    warmup_day: int,
    current_daily_volume: int,
    open_rate: float,
    reply_rate: float,
    bounce_rate: float,
    spam_complaints: int,
    list_type: str = "cold",
    number_of_inboxes: int = 1,
    inbox_placement_rate: float = None,
    day_of_week: str = None
) -> Dict[str, Any]:
    """
    Calculate safe next-day volume based on warm-up rules and performance metrics.
    """
    
    # Phase-based max increase
    if warmup_day <= 14:
        max_increase_per_inbox = 5
    elif warmup_day <= 21:
        max_increase_per_inbox = 10
    else:
        max_increase_per_inbox = 15
    
    # 20% hard cap
    max_allowed_increase = int(current_daily_volume * 0.20)
    allowed_increase = min(max_increase_per_inbox, max_allowed_increase)
    
    # Default action and volume
    action = "SCALE"
    next_volume = current_daily_volume + allowed_increase
    reasoning = f"Day {warmup_day} warm-up, calculating safe increase"
    risk_flag = "NONE"
    
    # Critical failure conditions
    if spam_complaints > 0:
        action = "FREEZE"
        next_volume = current_daily_volume
        reasoning = f"Spam complaint detected ({spam_complaints}) - holding volume to investigate"
        risk_flag = "Spam complaint detected"
    
    elif bounce_rate > 5:
        action = "EMERGENCY REDUCE"
        next_volume = int(current_daily_volume * 0.7)
        reasoning = f"High bounce rate ({bounce_rate}%) - reducing volume to protect reputation"
        risk_flag = "High bounce rate"
    
    # Moderate risk conditions
    elif open_rate < 35 or bounce_rate > 3:
        action = "HOLD"
        next_volume = current_daily_volume
        reasoning = f"Engagement below threshold (open: {open_rate}%, bounce: {bounce_rate}%)"
        risk_flag = "Engagement below threshold"
    
    # Inbox placement (if available)
    elif inbox_placement_rate is not None:
        if inbox_placement_rate < 60:
            action = "REDUCE"
            next_volume = int(current_daily_volume * 0.8)
            reasoning = f"Critical inbox placement issue ({inbox_placement_rate}%)"
            risk_flag = "Critical inbox placement issue"
        elif inbox_placement_rate < 70:
            action = "HOLD"
            next_volume = current_daily_volume
            reasoning = f"Poor inbox placement ({inbox_placement_rate}%)"
            risk_flag = "Poor inbox placement"
    
    # Positive scaling check
    elif open_rate >= 35 and bounce_rate <= 3 and spam_complaints == 0:
        action = "SCALE"
        next_volume = current_daily_volume + allowed_increase
        reasoning = f"Strong engagement (open: {open_rate}%, reply: {reply_rate}%) - scaling by {allowed_increase}"
        risk_flag = "NONE"
    
    # Weekend throttling for cold lists
    if day_of_week and day_of_week in ["Sat", "Sun"] and list_type == "cold":
        next_volume = int(next_volume * 0.8)
        action = "WEEKEND THROTTLE"
        reasoning += " | Weekend throttle applied for cold list"
    
    # Reputation protection failsafe
    if spam_complaints >= 2 or bounce_rate > 6:
        action = "HARD REDUCE"
        next_volume = int(current_daily_volume * 0.5)
        reasoning = f"Severe reputation risk detected - emergency volume reduction"
        risk_flag = "Severe reputation risk"
    
    total_system_volume = next_volume * number_of_inboxes
    
    return {
        "next_daily_volume_per_inbox": next_volume,
        "total_system_volume": total_system_volume,
        "action_taken": action,
        "reasoning": reasoning,
        "risk_flag": risk_flag,
        "allowed_increase": allowed_increase if action == "SCALE" else 0,
        "current_metrics": {
            "warmup_day": warmup_day,
            "open_rate": open_rate,
            "reply_rate": reply_rate,
            "bounce_rate": bounce_rate,
            "spam_complaints": spam_complaints,
            "inbox_placement_rate": inbox_placement_rate
        }
    }


def main():
    parser = argparse.ArgumentParser(description="Calculate safe email warm-up volume")
    parser.add_argument("--warmup-day", type=int, required=True, help="Current warm-up day")
    parser.add_argument("--current-volume", type=int, required=True, help="Yesterday's volume")
    parser.add_argument("--open-rate", type=float, required=True, help="Open rate percentage")
    parser.add_argument("--reply-rate", type=float, required=True, help="Reply rate percentage")
    parser.add_argument("--bounce-rate", type=float, required=True, help="Bounce rate percentage")
    parser.add_argument("--spam-complaints", type=int, required=True, help="Spam complaint count")
    parser.add_argument("--list-type", default="cold", choices=["cold", "warm"], help="List type")
    parser.add_argument("--num-inboxes", type=int, default=1, help="Number of inboxes")
    parser.add_argument("--inbox-placement", type=float, help="Inbox placement rate (optional)")
    parser.add_argument("--day-of-week", help="Day of week (optional)")
    
    args = parser.parse_args()
    
    result = calculate_safe_volume(
        warmup_day=args.warmup_day,
        current_daily_volume=args.current_volume,
        open_rate=args.open_rate,
        reply_rate=args.reply_rate,
        bounce_rate=args.bounce_rate,
        spam_complaints=args.spam_complaints,
        list_type=args.list_type,
        number_of_inboxes=args.num_inboxes,
        inbox_placement_rate=args.inbox_placement,
        day_of_week=args.day_of_week
    )
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
