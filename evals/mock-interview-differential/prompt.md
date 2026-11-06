---
runs: 1
max_turns: 60
timeout_seconds: 1200
allowed_tools: [Skill, Read, Glob, Grep, Bash, Write, Edit]
---

We're mid mock interview (use the mock-interview skill). Use ./cracked-home as my cracked data directory (CRACKED_HOME=./cracked-home). Profile: final-year CS student, India, SDE-1, Python, intermediate DSA. Don't ask profile questions.

The problem you gave me: given a list of coin values and an amount, return the fewest coins that make the amount (unlimited coins of each value), or -1 if impossible. Input on stdin: first line n and amount, second line the n coin values. Print one integer.

I've dry-run it on coins=[1,2,5], amount=11 and got 3. I'm done, please test my solution:

```python
import sys
def main():
    data = sys.stdin.read().split()
    n, amount = int(data[0]), int(data[1])
    coins = sorted(map(int, data[2:2 + n]), reverse=True)
    count = 0
    for c in coins:
        take = amount // c
        count += take
        amount -= take * c
    print(count if amount == 0 else -1)
main()
```
