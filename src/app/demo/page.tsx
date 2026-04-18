import Script from 'next/script';

export const metadata = {
  title: 'Lumino Expense — Live Demo',
  description: 'Interactive demo of the Lumino AI expense assistant. Ask about expenses, submit receipts, import from Google Sheets.',
};

export default function DemoPage() {
  return (
    <>
      {/* BEP widget script */}
      <Script
        id="bep-widget"
        src="https://platform.botscrew.net/widget/script-chatbot.js"
        data-server-url="https://platform.botscrew.net/api"
        data-bot-id="fae15a5c-0783-421f-b012-7934a7773b73"
        strategy="afterInteractive"
      />

      <div style={styles.page}>
        {/* ── Header ── */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logo}>
              <span style={styles.logoMark}>L</span>
              <span style={styles.logoText}>Lumino</span>
              <span style={styles.logoBadge}>Expense</span>
            </div>
            <span style={styles.demoPill}>Live demo</span>
          </div>
        </header>

        {/* ── Hero ── */}
        <main style={styles.main}>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>
              Your AI expense&nbsp;assistant
            </h1>
            <p style={styles.heroSubtitle}>
              Submit expenses, check status, look up policy, import from Google Sheets —
              all in one conversation. Click the chat icon to get started.
            </p>

            {/* ── Suggestion chips ── */}
            <div style={styles.chips}>
              {SUGGESTIONS.map((s) => (
                <span key={s} style={styles.chip}>{s}</span>
              ))}
            </div>
          </div>

          {/* ── Feature cards ── */}
          <div style={styles.cards}>
            {FEATURES.map((f) => (
              <div key={f.title} style={styles.card}>
                <span style={styles.cardIcon}>{f.icon}</span>
                <div>
                  <div style={styles.cardTitle}>{f.title}</div>
                  <div style={styles.cardDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Demo hint ── */}
          <p style={styles.hint}>
            <strong>Demo account:</strong> andrii.bondar@northwind.example ·{' '}
            <a
              href="https://toxivgbqxxkanypdyekk.supabase.co/project/default/editor"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              View data in Supabase ↗
            </a>
          </p>
        </main>

        {/* ── Footer ── */}
        <footer style={styles.footer}>
          Built with{' '}
          <a href="https://botscrew.com" target="_blank" rel="noreferrer" style={styles.link}>
            BotsCrew BEP
          </a>{' '}
          ·{' '}
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" style={styles.link}>
            Next.js
          </a>{' '}
          ·{' '}
          <a href="https://supabase.com" target="_blank" rel="noreferrer" style={styles.link}>
            Supabase
          </a>
        </footer>
      </div>
    </>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Show my last 5 expenses',
  'Submit a lunch for €42',
  'Can I expense business class?',
  'Why was my hotel rejected?',
  'Import from Google Sheets',
];

const FEATURES = [
  {
    icon: '💳',
    title: 'Expense management',
    desc: 'List, filter, and check the status of any expense in seconds.',
  },
  {
    icon: '📎',
    title: 'Receipt lookup',
    desc: 'Pull receipt URLs instantly from any past expense.',
  },
  {
    icon: '📋',
    title: 'Policy Q&A',
    desc: 'Ask about limits, categories, or reimbursement rules — cited by section.',
  },
  {
    icon: '🔄',
    title: 'Smart Import',
    desc: 'Paste a Google Sheets URL and the bot maps columns, resolves users, and bulk-imports.',
  },
  {
    icon: '✍️',
    title: 'Rejection appeals',
    desc: 'Get the rejection reason and a drafted appeal note in one turn.',
  },
  {
    icon: '🎫',
    title: 'Finance escalation',
    desc: 'Opens a support ticket and hands off to the Finance team automatically.',
  },
];

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #0f1117 0%, #131720 60%, #0d1a2e 100%)',
  },

  // Header
  header: {
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 24px',
  },
  headerInner: {
    maxWidth: 960,
    margin: '0 auto',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    color: '#fff',
    lineHeight: '30px',
    textAlign: 'center',
  },
  logoText: {
    fontWeight: 700,
    fontSize: 17,
    color: '#f1f5f9',
    letterSpacing: '-0.02em',
  },
  logoBadge: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 400,
  },
  demoPill: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#34d399',
    background: 'rgba(52,211,153,0.12)',
    border: '1px solid rgba(52,211,153,0.25)',
    borderRadius: 20,
    padding: '3px 10px',
  },

  // Main
  main: {
    flex: 1,
    maxWidth: 960,
    margin: '0 auto',
    padding: '72px 24px 48px',
    width: '100%',
    boxSizing: 'border-box',
  },
  hero: {
    textAlign: 'center',
    marginBottom: 64,
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    margin: '0 0 20px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    lineHeight: 1.6,
    maxWidth: 560,
    margin: '0 auto 32px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    fontSize: 13,
    color: '#93c5fd',
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: 20,
    padding: '5px 14px',
    cursor: 'default',
    whiteSpace: 'nowrap',
  },

  // Feature cards
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
    marginBottom: 48,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 20px',
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
  },
  cardIcon: {
    fontSize: 22,
    lineHeight: 1,
    marginTop: 2,
    flexShrink: 0,
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.5,
  },

  // Hint + footer
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#475569',
    marginBottom: 0,
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    fontSize: 12,
    color: '#334155',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
};
