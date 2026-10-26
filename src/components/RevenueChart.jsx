import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../data/sales";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey}>
          <i style={{ background: entry.color }} aria-hidden="true" />
          {entry.name}: {formatCurrency(entry.value)}
        </span>
      ))}
    </div>
  );
}

export default function RevenueChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const goal = data.reduce((sum, item) => sum + item.goal, 0);

  return (
    <article className="panel chart-panel">
      <header className="panel-head">
        <div>
          <h2>Receita x meta</h2>
          <p>
            {formatCurrency(total)} de {formatCurrency(goal)} planejados
          </p>
        </div>
        <div className="chart-legend" aria-hidden="true">
          <span><i className="legend-revenue" />Receita</span>
          <span><i className="legend-goal" />Meta</span>
        </div>
      </header>

      {data.length === 0 ? (
        <p className="chart-empty">Sem dados no período selecionado.</p>
      ) : (
        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5eead4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22304d" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8fa1c1", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                width={48}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8fa1c1", fontSize: 12 }}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2a3c60" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke="#5eead4"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="goal"
                name="Meta"
                stroke="#a78bfa"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
