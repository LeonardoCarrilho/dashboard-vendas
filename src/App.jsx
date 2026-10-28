import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import ChannelChart from "./components/ChannelChart";
import OrdersTable from "./components/OrdersTable";
import {
  DATA_END_DATE,
  DATA_UPDATED_ISO,
  DATA_UPDATED_LABEL,
  daily,
  formatCurrency,
  orders,
} from "./data/sales";
import { PERIODS, buildDashboardView } from "./utils/analytics";

const formatPercent = (value) =>
  `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

export default function App() {
  const [period, setPeriod] = useState(30);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = document.getElementById("dashboard-menu");
    const trigger = document.querySelector(".menu-button");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.querySelector("button, a").focus();
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab") return;
      const links = [...menu.querySelectorAll("a, button")].filter(el => el.getClientRects().length);
      const first = links[0], last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
      if (!desktop.matches) trigger.focus();
    };
  }, [menuOpen]);

  const view = useMemo(
    () => buildDashboardView({ daily, orders, days: period, endDate: DATA_END_DATE }),
    [period]
  );

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
            aria-controls="dashboard-menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar-title">
            <span className="topbar-eyebrow">Painel comercial</span>
            <h1>Visão geral</h1>
            <p className="last-updated">
              Última atualização:{" "}
              <time dateTime={DATA_UPDATED_ISO}>{DATA_UPDATED_LABEL}</time>
            </p>
          </div>

          <div className="period-switch" role="group" aria-label="Período">
            {PERIODS.map((days) => (
              <button
                key={days}
                type="button"
                className={period === days ? "is-active" : ""}
                onClick={() => setPeriod(days)}
                aria-pressed={period === days}
              >
                {days} dias
              </button>
            ))}
          </div>
        </header>

        <section id="overview" className="section-block" aria-labelledby="overview-title">
          <div className="section-heading">
            <div>
              <h2 id="overview-title">Indicadores do período</h2>
              <p>
                {view.isEmpty
                  ? "Nenhum dado consolidado no período"
                  : `Últimos ${period} dias · meta batida em ${view.kpis.goalReached} de ${view.kpis.days} dias`}
              </p>
            </div>
            <span className="live-badge">
              <span className="live-dot" aria-hidden="true" />
              Dados de demonstração
            </span>
          </div>

          {view.isEmpty ? (
            <div className="panel empty-state" role="status">
              <span aria-hidden="true">📉</span>
              <h3>Sem dados no período</h3>
              <p>Escolha outro intervalo para ver indicadores, gráficos e pedidos.</p>
            </div>
          ) : (
            <div className="stats-grid">
              <StatCard
                icon="revenue"
                label="Receita total"
                value={formatCurrency(view.kpis.revenue)}
                delta={view.kpis.revenueDelta}
                note="vs. período anterior"
              />
              <StatCard
                icon="orders"
                label="Pedidos"
                value={view.kpis.orders.toLocaleString("pt-BR")}
                delta={view.kpis.ordersDelta}
                note="vs. período anterior"
              />
              <StatCard
                icon="ticket"
                label="Ticket médio"
                value={formatCurrency(view.kpis.ticket)}
                note="média do período"
              />
              <StatCard
                icon="conversion"
                label="Conversão"
                value={formatPercent(view.kpis.conversion)}
                delta={view.kpis.conversionDelta}
                deltaLabel="p.p."
                note="vs. período anterior"
              />
            </div>
          )}
        </section>

        {!view.isEmpty && (
          <section className="charts-grid" aria-label="Gráficos">
            <RevenueChart data={view.series} />
            <ChannelChart data={view.channels} />
          </section>
        )}

        <OrdersTable
          orders={view.orders}
          days={period}
          endDate={view.endDate ?? DATA_END_DATE}
        />
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
