import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import ChannelChart from "./components/ChannelChart";
import OrdersTable from "./components/OrdersTable";
import { channels, formatCurrency, monthly, recentOrders } from "./data/sales";

const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);

const percentChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export default function App() {
  const [period, setPeriod] = useState(6);
  const [menuOpen, setMenuOpen] = useState(false);

  const view = useMemo(() => {
    const visible = monthly.slice(-period);
    const last = monthly[monthly.length - 1];
    const beforeLast = monthly[monthly.length - 2];
    const revenue = sum(visible, "revenue");
    const orders = sum(visible, "orders");
    const ticket = orders ? revenue / orders : 0;

    return {
      visible,
      revenue,
      orders,
      ticket,
      revenueDelta: percentChange(last.revenue, beforeLast.revenue),
      ordersDelta: percentChange(last.orders, beforeLast.orders),
      goalReached: visible.filter((item) => item.revenue >= item.goal).length,
    };
  }, [period]);

  return (
    <div className="app">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar-title">
            <span className="topbar-eyebrow">Painel comercial</span>
            <h1>Visão geral</h1>
          </div>

          <div className="period-switch" role="group" aria-label="Período">
            <button
              type="button"
              className={period === 6 ? "is-active" : ""}
              onClick={() => setPeriod(6)}
              aria-pressed={period === 6}
            >
              6 meses
            </button>
            <button
              type="button"
              className={period === 12 ? "is-active" : ""}
              onClick={() => setPeriod(12)}
              aria-pressed={period === 12}
            >
              12 meses
            </button>
          </div>
        </header>

        <section id="overview" className="section-block" aria-labelledby="overview-title">
          <div className="section-heading">
            <div>
              <h2 id="overview-title">Indicadores do período</h2>
              <p>
                Últimos {period} meses · meta batida em {view.goalReached} de{" "}
                {view.visible.length} meses
              </p>
            </div>
            <span className="live-badge">
              <span className="live-dot" aria-hidden="true" />
              Dados de demonstração
            </span>
          </div>

          <div className="stats-grid">
            <StatCard
              icon="revenue"
              label="Receita total"
              value={formatCurrency(view.revenue)}
              delta={view.revenueDelta}
              note="vs. mês anterior"
            />
            <StatCard
              icon="orders"
              label="Pedidos"
              value={view.orders.toLocaleString("pt-BR")}
              delta={view.ordersDelta}
              note="vs. mês anterior"
            />
            <StatCard
              icon="ticket"
              label="Ticket médio"
              value={formatCurrency(view.ticket)}
              note="média do período"
            />
            <StatCard
              icon="conversion"
              label="Conversão"
              value="3,8%"
              delta={0.4}
              deltaLabel="p.p."
              note="vs. mês anterior"
            />
          </div>
        </section>

        <section className="charts-grid" aria-label="Gráficos">
          <RevenueChart data={view.visible} />
          <ChannelChart data={channels} />
        </section>

        <OrdersTable orders={recentOrders} />
      </main>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
