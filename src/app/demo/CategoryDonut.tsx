'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Expense {
  amount: number;
  category: string;
}

interface Props {
  expenses: Expense[] | null;
  loading: boolean;
}

const CAT_COLORS: Record<string, string> = {
  Travel: '#378ADD',
  Meals: '#0F6E56',
  Office: '#854F0B',
  Entertainment: '#993556',
  Supplies: '#534AB7',
  Lodging: '#1D9E75',
};

function fmtEur(n: number) {
  return '€' + Math.round(n).toLocaleString('de-DE');
}

export default function CategoryDonut({ expenses, loading }: Props) {
  const data: { name: string; value: number }[] = [];

  if (expenses) {
    const map: Record<string, number> = {};
    for (const e of expenses) {
      if (e.category) map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    for (const [name, value] of Object.entries(map)) {
      if (value > 0) data.push({ name, value });
    }
    data.sort((a, b) => b.value - a.value);
  }

  return (
    <div style={s.card}>
      <div style={s.heading}>Category breakdown</div>
      {loading ? (
        <div style={s.placeholder} />
      ) : data.length === 0 ? (
        <div style={s.empty}>No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="40%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CAT_COLORS[entry.name] ?? '#9CA3AF'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [fmtEur(Number(value)), 'Amount']}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={7}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#5C5C5C' }}>{value}</span>
              )}
            />
          </PieChart>
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
    animation: 'shimmer 1.4s infinite',
  },
  empty: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#8C8C8C',
  },
};
