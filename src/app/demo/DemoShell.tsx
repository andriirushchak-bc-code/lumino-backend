'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';
import TopNav from './TopNav';
import KpiTiles from './KpiTiles';
import CategoryDonut from './CategoryDonut';
import TrendChart from './TrendChart';
import ExpenseTable from './ExpenseTable';

// Publishable (anon) key — safe to use client-side, already public in widget config
const sb = createClient(
  'https://toxivgbqxxkanypdyekk.supabase.co',
  'sb_publishable_Lz-hTNqahfeJoto5-bs9NQ_5KfmAPiA',
);

const DEMO_USER = 'andrii.bondar@northwind.example';

interface Expense {
  id: string;
  submitted_at: string;
  merchant: string;
  category: string;
  amount: number;
  status: string;
}

export default function DemoShell() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbErr } = await sb
          .from('expenses')
          .select('id, submitted_at, merchant, category, amount, status')
          .eq('user_email', DEMO_USER)
          .order('submitted_at', { ascending: false })
          .limit(25);

        if (sbErr) throw sbErr;
        if (!cancelled) setExpenses(data ?? []);
      } catch {
        if (!cancelled) setError("Couldn't load expenses. Refresh to retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function openWidget() {
    // BEP widget exposes a global toggle — attempt to call it, silently fail if not ready
    try {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe[title*="otscrew"], iframe[src*="botscrew"]');
      if (iframe) {
        const parent = iframe.parentElement;
        if (parent) {
          const btn = parent.querySelector<HTMLElement>('[class*="toggle"], [class*="button"], button');
          if (btn) { btn.click(); return; }
        }
      }
      // Fallback: try BEP global API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.BEPWidget?.open) w.BEPWidget.open();
      else if (w.chatbot?.open) w.chatbot.open();
    } catch { /* silent */ }
  }

  return (
    <>
      {/* BEP widget — unchanged from previous setup */}
      <Script
        id="chatbot-initials-script"
        src="https://platform.botscrew.net/widget/script-chatbot.js"
        data-server-url="https://platform.botscrew.net/api"
        data-bot-id="fae15a5c-0783-421f-b012-7934a7773b73"
        strategy="afterInteractive"
      />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={s.page}>
        <TopNav />

        <main style={s.container}>
          {/* Page title row */}
          <div style={s.titleRow}>
            <h1 style={s.pageTitle}>Expenses</h1>
            <button style={s.newBtn} onClick={openWidget}>+ New expense</button>
          </div>

          {/* KPI tiles */}
          <KpiTiles expenses={expenses} loading={loading} />

          {/* Charts row */}
          <div style={s.chartsRow}>
            <CategoryDonut expenses={expenses} loading={loading} />
            <TrendChart expenses={expenses} loading={loading} />
          </div>

          {/* Expense table */}
          <ExpenseTable expenses={expenses} loading={loading} error={error} />

          {/* Footer */}
          <p style={s.footer}>
            Demo environment · {DEMO_USER} · Data refreshes on page load
          </p>
        </main>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F6F5F1',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '24px 24px 0',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#0D0D0D',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  newBtn: {
    background: '#378ADD',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 10,
    marginBottom: 16,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#A8A49C',
    marginTop: 24,
    paddingBottom: 16,
  },
};
