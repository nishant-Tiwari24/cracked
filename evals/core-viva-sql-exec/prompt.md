---
runs: 1
max_turns: 40
timeout_seconds: 900
allowed_tools: [Skill, Read, Glob, Grep, Bash, Write, Edit]
---

I'm doing core viva SQL practice. Grade my answer.
Question: Table Employee(id INTEGER, name TEXT, salary INTEGER) with rows (1,'A',100), (2,'B',100), (3,'C',90), (4,'D',80). Write a query returning the second highest distinct salary.
My answer: SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;
Use ./cracked-home as my cracked data directory (CRACKED_HOME=./cracked-home). My profile, so you don't need to ask: Rahul Verma, final-year B.Tech CS student (2026 grad), India, targeting SDE-1 backend roles at product companies, interview language Python, intermediate DSA (~250 problems), placements start in 8 weeks, 4 hours/day.
