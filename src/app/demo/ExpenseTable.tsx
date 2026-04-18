'use client';

interface Expense {
  id: string;
  submitted_at: string;
  merchant: string;
  category: string;
  amount: number;
  status: string;
}

interface Props {
  expenses: Expense[] | null;
  loading: boolean;
  error: string | null;
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}

function fmtAmount(n: number) {
  return '€' + n.toFixed(2);
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#FAEEDA', color: '#854F0B' },
  approved: { bg: '#E1F5EE', color: '#0F6E56' },
  rejected: { bg: '#FCEBEB', color: '#A32D2D' },
  paid:     { bg: '#E6F1FB', color: '#0C447C' },
};

function SkeletonRow() {
  return (
    <div style={s.row}>
      {[90, 180, 100, 80, 80].map((w, i) => (
        <div key={i} style={{ ...s.skeletonCell, width: w }}>
          <div style={s.skeletonBar} />
        </div>
      ))}
    </div>
  );
}

export default function ExpenseTable({ expenses, loading, error }: Props) {
  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.colDate}>Date</span>
        <span style={s.colMerchant}>Merchant</span>
        <span style={s.colCategory}>Category</span>
        <span style={s.colAmount}>Amount</span>
        <span style={s.colStatus}>Status</span>
      </div>

      {/* Body */}
      {loading ? (
        <>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
        </>
      ) : error ? (
        <div style={s.stateMsg}>
          <span style={{ color: '#A32D2D' }}>{error}</span>
        </div>
      ) : !expenses || expenses.length === 0 ? (
        <div style={s.stateMsg}>No expenses yet.</div>
      ) : (
        expenses.map((e, idx) => {
          const st = STATUS_STYLE[e.status] ?? { bg: '#F1EFE8', color: '#5C5C5C' };
          const isLast = idx === expenses.length - 1;
          return (
            <div key={e.id} style={{ ...s.row, borderBottom: isLast ? 'none' : '0.5px solid rgba(0,0,0,0.07)' }}>
              <span style={s.cellDate}>{fmtDate(e.submitted_at)}</span>
              <span style={s.cellMerchant}>{e.merchant}</span>
              <span style={s.cellCategory}>{e.category}</span>
              <span style={s.cellAmount}>{fmtAmount(e.amount)}</span>
              <span style={s.cellStatus}>
                <span style={{ ...s.pill, background: st.bg, color: st.color }}>
                  {e.status}
                </span>
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

const COL = 'grid-template-columns: 90px 1.5fr 1fr 80px 90px';

const s: Record<string, React.CSSProperties> = {
  card: {
    background: '#FFFFFF',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '90px 1.5fr 1fr 80px 90px',
    gap: 12,
    padding: '10px 16px',
    background: '#F1EFE8',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    fontSize: 11,
    color: '#8C8C8C',
    alignItems: 'center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '90px 1.5fr 1fr 80px 90px',
    gap: 12,
    padding: '11px 16px',
    fontSize: 13,
    alignItems: 'center',
    borderBottom: '0.5px solid rgba(0,0,0,0.07)',
  },
  colDate:     { },
  colMerchant: { },
  colCategory: { },
  colAmount:   { textAlign: 'right' },
  colStatus:   { textAlign: 'center' },
  cellDate:     { color: '#8C8C8C', fontSize: 13 },
  cellMerchant: { color: '#0D0D0D', fontSize: 13 },
  cellCategory: { color: '#8C8C8C', fontSize: 13 },
  cellAmount:   { textAlign: 'right', fontSize: 13, color: '#0D0D0D' },
  cellStatus:   { textAlign: 'center' },
  pill: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: '16px',
  },
  stateMsg: {
    padding: '32px 16px',
    textAlign: 'center',
    fontSize: 13,
    color: '#8C8C8C',
  },
  skeletonCell: {
    display: 'flex',
    alignItems: 'center',
  },
  skeletonBar: {
    height: 12,
    width: '80%',
    background: 'linear-gradient(90deg, #F1EFE8 25%, #E8E6DF 50%, #F1EFE8 75%)',
    backgroundSize: '200% 100%',
    borderRadius: 4,
    animation: 'shimmer 1.4s infinite',
  },
};
