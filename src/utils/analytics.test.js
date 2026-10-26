import { describe, expect, it } from "vitest";
import {
  PERIODS,
  aggregateChannels,
  buildDashboardView,
  buildRevenueSeries,
  filterByPeriod,
  formatShortDate,
  percentChange,
  previousWindow,
  resolveEndDate,
  summarize,
} from "./analytics";
import { channelMeta } from "../data/sales";

const daily = [
  {
    date: "2026-10-01",
    revenue: 1000,
    orders: 10,
    visits: 250,
    goal: 900,
    channels: { loja: 500, marketplace: 300, instagram: 150, indicacao: 50 },
  },
  {
    date: "2026-10-02",
    revenue: 800,
    orders: 8,
    visits: 200,
    goal: 900,
    channels: { loja: 400, marketplace: 200, instagram: 150, indicacao: 50 },
  },
  {
    date: "2026-10-03",
    revenue: 1200,
    orders: 12,
    visits: 300,
    goal: 900,
    channels: { loja: 600, marketplace: 300, instagram: 200, indicacao: 100 },
  },
];

const orders = [
  { id: "#1001", customer: "Ana", product: "Fone", value: 100, status: "Pago", date: "2026-10-01" },
  { id: "#1002", customer: "Bruno", product: "Mouse", value: 200, status: "Pago", date: "2026-10-03" },
  { id: "#1003", customer: "Carla", product: "Hub", value: 50, status: "Enviado", date: "2026-10-03" },
];

const dates = (rows) => rows.map((row) => row.date);

describe("formatShortDate", () => {
  it("converte ISO em dia/mês", () => {
    expect(formatShortDate("2026-10-05")).toBe("05/10");
    expect(formatShortDate("")).toBe("");
  });
});

describe("filterByPeriod", () => {
  it("mantém apenas a janela pedida, incluindo os limites", () => {
    expect(dates(filterByPeriod(daily, 2, "2026-10-03"))).toEqual([
      "2026-10-02",
      "2026-10-03",
    ]);
    expect(dates(filterByPeriod(daily, 3, "2026-10-03"))).toHaveLength(3);
  });

  it("usa a data mais recente quando o fim não é informado", () => {
    expect(dates(filterByPeriod(daily, 1))).toEqual(["2026-10-03"]);
    expect(resolveEndDate(daily)).toBe("2026-10-03");
  });

  it("trata listas vazias ou períodos inválidos", () => {
    expect(filterByPeriod([], 7)).toEqual([]);
    expect(filterByPeriod(daily, Number.NaN)).toEqual([]);
  });
});

describe("previousWindow", () => {
  it("busca a janela imediatamente anterior", () => {
    expect(dates(previousWindow(daily, 2, "2026-10-03"))).toEqual(["2026-10-01"]);
    expect(previousWindow([], 7)).toEqual([]);
  });
});

describe("summarize", () => {
  it("calcula receita, pedidos, ticket, conversão e metas", () => {
    expect(summarize(daily)).toEqual({
      days: 3,
      revenue: 3000,
      orders: 30,
      visits: 750,
      ticket: 100,
      conversion: 4,
      goalReached: 2,
    });
  });

  it("evita divisão por zero", () => {
    expect(summarize([])).toMatchObject({ revenue: 0, ticket: 0, conversion: 0, days: 0 });
  });
});

describe("percentChange", () => {
  it("calcula a variação percentual", () => {
    expect(percentChange(120, 100)).toBeCloseTo(20);
    expect(percentChange(80, 100)).toBeCloseTo(-20);
    expect(percentChange(120, 0)).toBe(0);
  });
});

describe("aggregateChannels", () => {
  it("distribui a receita por canal", () => {
    const channels = aggregateChannels(daily);

    expect(channels.map((channel) => channel.name)).toEqual(
      channelMeta.map((channel) => channel.name)
    );
    expect(channels.map((channel) => channel.revenue)).toEqual([1500, 800, 500, 200]);
    expect(channels.reduce((total, channel) => total + channel.value, 0)).toBe(100);
    expect(channels[0].value).toBe(49);
  });

  it("retorna percentuais zerados sem dados", () => {
    const channels = aggregateChannels([]);

    expect(channels).toHaveLength(4);
    expect(channels.every((channel) => channel.value === 0)).toBe(true);
  });
});

describe("buildRevenueSeries", () => {
  it("usa um ponto por dia em períodos curtos", () => {
    expect(buildRevenueSeries(daily, 7)).toEqual([
      { label: "01/10", revenue: 1000, goal: 900 },
      { label: "02/10", revenue: 800, goal: 900 },
      { label: "03/10", revenue: 1200, goal: 900 },
    ]);
  });

  it("agrupa em semanas no período de 90 dias", () => {
    expect(buildRevenueSeries(daily, 90)).toEqual([
      { label: "01/10", revenue: 3000, goal: 2700 },
    ]);
  });

  it("retorna série vazia sem dados", () => {
    expect(buildRevenueSeries([], 30)).toEqual([]);
  });
});

describe("buildDashboardView", () => {
  it("monta KPIs, gráficos e pedidos do período", () => {
    const view = buildDashboardView({
      daily,
      orders,
      days: 2,
      endDate: "2026-10-03",
    });

    expect(view.isEmpty).toBe(false);
    expect(view.endDate).toBe("2026-10-03");
    expect(view.kpis).toMatchObject({
      revenue: 2000,
      orders: 20,
      ticket: 100,
      goalReached: 1,
      days: 2,
    });
    expect(view.kpis.conversion).toBeCloseTo(4);
    expect(view.kpis.revenueDelta).toBeCloseTo(100);
    expect(view.kpis.conversionDelta).toBeCloseTo(0);
    expect(view.series).toHaveLength(2);
    expect(view.channels).toHaveLength(4);
    expect(view.orders.map((order) => order.id)).toEqual(["#1003", "#1002"]);
    expect(view.lastUpdated).toBeTypeOf("string");
  });

  it("marca o período como vazio quando não há dados", () => {
    const view = buildDashboardView({ daily: [], orders: [], days: 7 });

    expect(view.isEmpty).toBe(true);
    expect(view.series).toEqual([]);
    expect(view.orders).toEqual([]);
    expect(view.kpis).toMatchObject({ revenue: 0, orders: 0, ticket: 0 });
    expect(view.channels.every((channel) => channel.value === 0)).toBe(true);
  });

  it("suporta os três períodos disponíveis", () => {
    expect(PERIODS).toEqual([7, 30, 90]);

    PERIODS.forEach((days) => {
      const view = buildDashboardView({ daily, orders, days, endDate: "2026-10-03" });
      expect(view.days).toBe(days);
      expect(view.orders.length).toBeGreaterThan(0);
    });
  });
});
