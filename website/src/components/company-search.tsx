"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { asset } from "@/lib/site";

type Q = { Difficulty: string; Title: string; Frequency: string; Link: string; Topics: string };
const RAW = "https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/";

function parseCSV(text: string): Q[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])) as Q);
}

const diffColor: Record<string, string> = { easy: "text-yes", medium: "text-gold", hard: "text-no" };

export function CompanySearch() {
  const [names, setNames] = useState<string[]>([]);
  const [query, setQuery] = useState("Google");
  const [company, setCompany] = useState<string | null>(null);
  const [state, setState] = useState<{ status: "idle" | "loading" | "ok" | "error"; rows: Q[]; window: string }>({ status: "idle", rows: [], window: "" });

  useEffect(() => {
    fetch(asset("/data/companies.json")).then((r) => r.json()).then((n: string[]) => { setNames(n); setCompany("Google"); });
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || names.some((n) => n.toLowerCase() === q)) return [];
    return names.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [query, names]);

  useEffect(() => {
    if (!company) return;
    let cancelled = false;
    (async () => {
      for (const [file, label] of [["3. Six Months.csv", "last 6 months"], ["5. All.csv", "all time"]] as const) {
        try {
          const r = await fetch(RAW + encodeURIComponent(company) + "/" + encodeURIComponent(file));
          if (!r.ok) continue;
          const rows = parseCSV(await r.text()).sort((a, b) => parseFloat(b.Frequency) - parseFloat(a.Frequency)).slice(0, 10);
          if (rows.length) { if (!cancelled) setState({ status: "ok", rows, window: label }); return; }
        } catch { /* next window */ }
      }
      if (!cancelled) setState({ status: "error", rows: [], window: "" });
    })();
    return () => { cancelled = true; };
  }, [company]);

  const choose = (n: string) => {
    setQuery(n);
    if (n !== company) setState((s) => ({ ...s, status: "loading" }));
    setCompany(n);
  };

  return (
    <div>
      <div className="relative max-w-[520px]">
        <label htmlFor="co" className="sr-only">Company</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input
          id="co"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const hit = names.find((n) => n.toLowerCase() === query.trim().toLowerCase()) ?? suggestions[0];
              if (hit) choose(hit);
            }
          }}
          placeholder="Search 470 companies"
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full rounded-[9px] border border-line-strong bg-card pl-11 pr-4 text-[17px] text-foreground placeholder:text-faint focus:border-accent-line focus:outline-none"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-[9px] border border-line-strong bg-[#0d0d0c] py-1 shadow-2xl">
            {suggestions.map((n) => (
              <li key={n}>
                <button type="button" onClick={() => choose(n)} className="w-full px-4 py-2 text-left text-[16px] text-body hover:bg-hover hover:text-foreground">
                  {n}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 rounded-[9px] border border-line bg-card" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
          <p className="text-[17px] font-semibold text-foreground">{company ?? "…"}</p>
          <p className="font-mono text-[13px] text-fg-muted">
            {state.status === "ok" ? `top ${state.rows.length} by reported frequency · ${state.window}` : state.status === "loading" ? "loading…" : ""}
          </p>
        </div>
        {state.status === "error" && <p className="px-5 py-6 text-fg-muted">Couldn&apos;t load this company right now. Check your connection and try again.</p>}
        {state.status !== "error" && (
          <ol className={`divide-y divide-line transition-opacity ${state.status === "loading" ? "opacity-50" : ""}`}>
            {state.rows.map((q, i) => {
              const d = q.Difficulty.toLowerCase();
              return (
                <li key={q.Link} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 px-5 py-3">
                  <span className="font-mono text-[13px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <a href={q.Link} target="_blank" rel="noopener" className="text-[16px] text-foreground hover:text-gold">{q.Title}</a>
                    <span className="block truncate text-[13px] text-fg-muted">{q.Topics}</span>
                  </span>
                  <span className={`font-mono text-[12px] ${diffColor[d] ?? "text-fg-muted"}`}>{d}</span>
                </li>
              );
            })}
          </ol>
        )}
        <p className="border-t border-line px-5 py-4 text-[15px] text-fg-muted">
          Practise these under interview conditions: <span className="chip">mock interview for {company ?? "Google"}</span>
        </p>
      </div>
    </div>
  );
}
