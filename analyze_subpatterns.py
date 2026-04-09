import csv
from datetime import datetime
import re

file_path = "IITH Product Workshop - Instagram - Dataset - JbL - Final.csv"

def parse_count(count_str):
    if not count_str: return 0
    return int(re.sub(r'[,"]', '', count_str))

def get_age_years(date_str):
    if not date_str: return 0
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return (datetime.now() - dt).days / 365.25
    except:
        return 0

sub_patterns = {
    "Addiction: Late Night": ["3am", "at night", "sleep", "midnight", "bed"],
    "Addiction: Mindless/Regret": ["zombie", "mindless", "wasted", "regret", "lose track of time", "forgot to eat", "hours", "trash", "shallow"],
    "Ads: Frequency": ["every 2nd", "every 3rd", "every other", "too many", "constant", "bombarded", "flood"],
    "Ads: Hostile UX": ["unskippable", "cannot skip", "auto play", "interrupt", "forced"],
    "Algorithm: Friends Missing": ["friends", "family", "where are my friends", "don't follow", "random"],
}

feedback_data = []
with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if len(row) < 5: continue
        feedback_data.append({
            "f_count": parse_count(row[1]),
            "age": get_age_years(row[3]),
            "feedback": row[4].lower()
        })

print("--- Sub-Pattern Analysis ---")
for pattern, keywords in sub_patterns.items():
    count = sum(1 for d in feedback_data if any(k in d["feedback"] for k in keywords))
    print(f"{pattern}: {count} ({count/len(feedback_data)*100:.1f}%)")

print("\n--- High-Value User (>10k followers) Pain Points ---")
hv_users = [d for d in feedback_data if d["f_count"] > 10000]
for pattern, keywords in sub_patterns.items():
    count = sum(1 for d in hv_users if any(k in d["feedback"] for k in keywords))
    print(f"{pattern}: {count} ({count/len(hv_users)*100:.1f}%)")

print("\n--- Account Age Impact (Older vs Newer) ---")
old_users = [d for d in feedback_data if d["age"] > 5]
new_users = [d for d in feedback_data if d["age"] <= 2]

print(f"Old Users (>5 years, Count: {len(old_users)}):")
for pattern, keywords in sub_patterns.items():
    count = sum(1 for d in old_users if any(k in d["feedback"] for k in keywords))
    print(f"  - {pattern}: {count} ({count/len(old_users)*100:.1f}%)")

print(f"New Users (<2 years, Count: {len(new_users)}):")
for pattern, keywords in sub_patterns.items():
    count = sum(1 for d in new_users if any(k in d["feedback"] for k in keywords))
    print(f"  - {pattern}: {count} ({count/len(new_users)*100:.1f}%)")
