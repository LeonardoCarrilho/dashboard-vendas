import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function ChannelTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="chart-tooltip">
      <strong>{item.name}</strong>
      <span>{item.value}% das vendas</span>
    </div>
  );
}

export default function ChannelChart({ data = [] }) {
  const total = data.reduce((sum, channel) => sum + channel.value, 0);

  return (
    <article className="panel chart-panel" id="channels">
      <header className="panel-head">
        <div>
          <h2>Origem das vendas</h2>
          <p>Participação por canal no período</p>
        </div>
      </header>

      {total === 0 ? (
        <p className="chart-empty">Sem dados no período selecionado.</p>
      ) : (
        <div className="channel-body">
          <div className="donut-wrap" aria-hidden="true" inert="">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChannelTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center" aria-hidden="true">
              <strong>100%</strong>
              <span>das vendas</span>
            </div>
          </div>

          <ul className="channel-list">
            {data.map((channel) => (
              <li key={channel.name}>
                <span className="channel-dot" style={{ background: channel.color }} />
                <span className="channel-name">{channel.name}</span>
                <strong>{channel.value}%</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
