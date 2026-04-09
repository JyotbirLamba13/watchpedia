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

themes = {
    "Addiction/Time Sink": ["addictive", "lose track of time", "trap", "hook", "hours", "stop scrolling", "brain rot", "3am", "forget to eat", "screen time", "zombie", "mindless"],
    "Ads/Monetization": ["ads", "sponsored", "promoted", "commercial", "marketing", "advertisement", "shopping", "pay for", "unskippable"],
    "Algorithm/Discovery": ["algorithm", "recommendations", "suggested", "explore", "feed", "rage bait", "irrelevant", "my friends", "where did my friends go", "random"],
    "Content Quality": ["garbage", "brain rot", "low value", "shallow", "no substance", "junk food", "memes", "stolen", "originality"],
    "UI/UX/Technical": ["bugs", "crashes", "layout", "dark mode", "ui", "ux", "font", "upload", "grid"],
    "Safety/Privacy": ["shadowban", "permissions", "contacts", "microphone", "scams", "bots", "support", "harassment"]
}

analysis = []
follower_segments = {"Low (<1k)": 0, "Mid (1k-10k)": 0, "High (>10k)": 0}
feedback_by_segment = {
    "Low (<1k)": {"count": 0, "themes": {t: 0 for t in themes}},
    "Mid (1k-10k)": {"count": 0, "themes": {t: 0 for t in themes}},
    "High (>10k)": {"count": 0, "themes": {t: 0 for t in themes}}
}

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if len(row) < 5: continue
        uid, followers, following, active_since, feedback = row[0], row[1], row[2], row[3], row[4]
        
        f_count = parse_count(followers)
        age = get_age_years(active_since)
        
        seg = "Low (<1k)"
        if 1000 <= f_count <= 10000: seg = "Mid (1k-10k)"
        elif f_count > 10000: seg = "High (>10k)"
        
        feedback_by_segment[seg]["count"] += 1
        
        text = feedback.lower()
        for theme, keywords in themes.items():
            if any(k in text for k in keywords):
                feedback_by_segment[seg]["themes"][theme] += 1

print("--- Data Exploration Summary ---")
for seg, data in feedback_by_segment.items():
    print(f"\nSegment: {seg} (Total: {data['count']})")
    for theme, count in data["themes"].items():
        percentage = (count / data['count'] * 100) if data['count'] > 0 else 0
        print(f"  - {theme}: {count} ({percentage:.1f}%)")

# Overall Theme Counts
overall_themes = {t: 0 for t in themes}
total_rows = 0
for seg, data in feedback_by_segment.items():
    total_rows += data['count']
    for theme, count in data["themes"].items():
        overall_themes[theme] += count

print(f"\nOverall Top Themes (Total Samples: {total_rows}):")
sorted_themes = sorted(overall_themes.items(), key=lambda x: x[1], reverse=True)
for theme, count in sorted_themes:
    print(f"  - {theme}: {count} ({count/total_rows*100:.1f}%)")
