import urllib.request
import json
import os
import re
import random

print("Downloading dictionary...")
url = "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
try:
    response = urllib.request.urlopen(url)
    words = response.read().decode('utf-8').splitlines()
except Exception as e:
    print(f"Error downloading dictionary: {e}")
    # Fallback minimal dictionary for testing
    words = ["apple", "banana", "cat", "dog", "elephant", "fish", "giraffe", "hat", "igloo", "jump", "kite", "lion", "monkey", "nest", "octopus", "penguin", "queen", "rabbit", "snake", "tiger", "umbrella", "van", "water", "xylophone", "yak", "zebra"]

valid_words = [w.lower() for w in words if len(w) >= 4 and len(w) <= 10 and re.match(r'^[a-z]+$', w)]

letters = {}
for w in valid_words:
    first_char = w[0]
    if first_char not in letters:
        letters[first_char] = []
    letters[first_char].append(w)

output_dict = {}
for letter, words_list in letters.items():
    random.shuffle(words_list)
    output_dict[letter] = words_list[:500]

with open("data.js", 'w') as f:
    f.write("window.dictData = " + json.dumps(output_dict) + ";\n")

print("Generated data.js!")
