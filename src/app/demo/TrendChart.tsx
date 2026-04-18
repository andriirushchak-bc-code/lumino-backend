'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Expense {
  amount: number;
  submitted_at: string;
}

interface Props {
  expenses: Expense[] | null;
  loading: boolean;
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthBuckets(expenses: Expense[]): { month: string; amount: number }[] {
  const now = new Date();
  const buckets: { key: string; label: string; amount: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({ key, label: MONTH_ABBR[d.getMonth()], amount: 0 });
  }

  for (const e of expenses) {
    const d = new Date(e.submitted_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.amount += e.amount;
  }

  return buckets.map(({ label, amount }) => ({ month: label, amount: Math.round(amount) }));
}

function fmtEur(n: number) {
  return '€' + Math.round(n).toLocaleString('de-DE');
}

// Custom bar shape with top-only rounded corners
function RoundedBar(props: {
  x?: number; y?: number; width?: number; height?: number; fill?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  const r = 4;
  if (height <= 0) return null;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
}

export default function TrendChart({ expenses, loading }: Props) {
  const data = expenses ? buildMonthBuckets(expenses) : [];

  return (
    <div style={s.card}>
      <div style={s.heading}>Monthly spend trend</div>
      {loading ? (
        <div style={s.placeholder} />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barSize={32} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#8C8C8C' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [fmtEur(Number(value)), 'Spend']}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
              cursor={{ fill: 'rgba(55,138,221,0.06)' }}
            />
            <Bar dataKey="amount" fill="#378ADD" shape={<RoundedBar />}>
              {data.map((entry) => (
                <Cell key={entry.month} fill="#378ADD" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: {
    background: '#FFFFFF',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  heading: {
    fontSize: 13,
    fontWeight: 500,
    color: '#5C5C5C',
    marginBottom: 12,
  },
  placeholder: {
    height: 180,
    background: '#F1EFE8',
    borderRadius: 8,
  },
};
