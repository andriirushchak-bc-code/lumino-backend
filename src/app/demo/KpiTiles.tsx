'use client';

interface Expense {
  amount: number;
  status: string;
  submitted_at: string;
}

interface Props {
  expenses: Expense[] | null;
  loading: boolean;
}

function fmtEur(n: number) {
  return '€' + Math.round(n).toLocaleString('de-DE');
}

export default function KpiTiles({ expenses, loading }: Props) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  let monthTotal = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  let ytdPaid = 0;

  if (expenses) {
    for (const e of expenses) {
      const d = new Date(e.submitted_at);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        monthTotal += e.amount;
      }
      if (e.status === 'pending') pendingCount++;
      if (e.status === 'rejected') rejectedCount++;
      if (e.status === 'paid' && d.getFullYear() === thisYear) {
        ytdPaid += e.amount;
      }
    }
  }

  const tiles = [
    { label: 'This month', value: loading ? '—' : fmtEur(monthTotal), color: undefined },
    { label: 'Pending', value: loading ? '—' : String(pendingCount), color: '#854F0B' },
    { label: 'Rejected', value: loading ? '—' : String(rejectedCount), color: '#A32D2D' },
    { label: 'Reimbursed YTD', value: loading ? '—' : fmtEur(ytdPaid), color: undefined },
  ];

  return (
    <div style={s.grid}>
      {tiles.map((t) => (
        <div key={t.label} style={s.tile}>
          <div style={s.label}>{t.label}</div>
          <div style={{ ...s.value, color: t.color ?? '#0D0D0D' }}>{t.value}</div>
        </div>
      ))}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  tile: {
    background: '#FFFFFF',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: '12px 14px',
  },
  label: {
    fontSize: 11,
    color: '#8C8C8C',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '-0.3px',
  },
};
