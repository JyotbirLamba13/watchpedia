import csv
import collections
import re

file_path = "IITH Product Workshop - Instagram - Dataset - JbL - Final.csv"

words = []
stop_words = set(['the', 'and', 'to', 'a', 'in', 'is', 'i', 'of', 'it', 'on', 'my', 'this', 'for', 'with', 'so', 'me', 'that', 'be', 'are', 'but', 'have', 'from', 'an', 'at', 'just', 'more', 'all', 'like', 'too', 'can', 'not', 'get', 'when', 'app', 'out', 'up', 'down', 'no', 'was', 'than', 'now', 'or', 'about', 'if', 'every', 'even', 'how', 'see', 'every', 'other', 'been', 'being', 'one', 'some', 'than', 'into', 'would', 'much', 'only', 'very', 'still', 'what', 'where', 'who', 'why', 'how', 'am', 'feel', 'felt', 'since', 'after', 'before', 'though', 'while', 'through', 'between', 'during', 'under', 'over', 'again', 'then', 'once', 'here', 'there', 'any', 'each', 'few', 'own', 'same', 'both', 'most', 'other', 'another', 'could', 'should', 'would', 'can', 'could', 'might', 'must', 'shall', 'will', 'should', 'would', 'ought', 'had', 'has', 'have', 'having', 'do', 'does', 'did', 'doing', 'done', 'go', 'goes', 'went', 'gone', 'going', 'come', 'comes', 'came', 'coming', 'get', 'gets', 'got', 'getting', 'make', 'makes', 'made', 'making', 'take', 'takes', 'took', 'taking', 'give', 'gives', 'gave', 'giving', 'find', 'finds', 'found', 'finding', 'say', 'says', 'said', 'saying', 'tell', 'tells', 'told', 'telling', 'know', 'knows', 'knew', 'knowing', 'think', 'thinks', 'thought', 'thinking', 'see', 'sees', 'saw', 'seeing', 'look', 'looks', 'looked', 'looking', 'use', 'uses', 'used', 'using', 'want', 'wants', 'wanted', 'wanting', 'try', 'tries', 'tried', 'trying', 'keep', 'keeps', 'kept', 'keeping', 'start', 'starts', 'started', 'starting', 'stop', 'stops', 'stopped', 'stopping', 'show', 'shows', 'showed', 'showing', 'show', 'shows', 'showed', 'showing', 'reel', 'reels', 'instagram', 'ig', 'post', 'posts', 'video', 'videos', 'story', 'stories', 'feed', 'scroll', 'scrolling', 'scrolled', 'scroller', 'content', 'experience', 'user', 'users', 'account', 'accounts', 'profile', 'profiles', 'time', 'hours', 'day', 'week', 'month', 'year', 'days', 'weeks', 'months', 'years', 'literally', 'actually', 'genuinely', 'honestly', 'really', 'definitely', 'totally', 'completely', 'absolutely', 'basically', 'actually', 'usually', 'often', 'sometimes', 'rarely', 'never', 'always', 'ever', 'almost', 'hardly', 'barely', 'scarcely', 'nearly', 'around', 'about', 'nearly', 'mostly', 'mainly', 'primarily', 'chiefly', 'mostly', 'largely', 'highly', 'extremely', 'pretty', 'quite', 'rather', 'somewhat', 'fairly', 'well', 'bad', 'good', 'better', 'worse', 'best', 'worst', 'bro', 'man', 'dude', 'guy', 'people', 'friends', 'family', 'someone', 'everyone', 'anyone', 'nobody', 'nothing', 'something', 'everything', 'anything'])

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        if len(row) < 5: continue
        text = row[4].lower()
        cleaned = re.sub(r'[^a-z\s]', '', text)
        for w in cleaned.split():
            if w not in stop_words and len(w) > 2:
                words.append(w)

counter = collections.Counter(words)
print("Top 30 non-stop words:")
for word, count in counter.most_common(30):
    print(f"{word}: {count}")
