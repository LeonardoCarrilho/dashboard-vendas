import { DATA_UPDATED_LABEL, channelMeta } from "../data/sales";

const DAY_MS = 24 * 60 * 60 * 1000;

export const PERIODS = [7, 30, 90];

export const PERIOD_LABELS = {
  7: "7 dias",
  30: "30 dias",
  90: "90 dias",
};

export function parseIsoDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(isoDate) {
  if (!isoDate) return "";
  const [, month, day] = isoDate.split("-");
  return day && month ? `${day}/${month}` : isoDate;
}

export function resolveEndDate(rows = [], endDate) {
  if (endDate) return endDate;
  if (!rows.length) return null;

  return rows.reduce((latest, row) => (row.date > latest ? row.date : latest), rows[0].date);
}

/**
 * Mantém as linhas dentro da janela de `days` dias terminando em `endDate`
 * (ou na data mais recente dos dados).
 */
export function filterByPeriod(rows = [], days, endDate) {
  if (!Array.isArray(rows) || rows.length === 0 || !Number.isFinite(days)) return [];

  const end = resolveEndDate(rows, endDate);
  if (!end) return [];

  const endTime = parseIsoDate(end).getTime();
  const startTime = endTime - (days - 1) * DAY_MS;

  return rows.filter((row) => {
    const time = parseIsoDate(row.date).getTime();
    return time >= startTime && time <= endTime;
  });
}

export function sumBy(items = [], key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

export function summarize(rows = []) {
  const revenue = sumBy(rows, "revenue");
  const orders = sumBy(rows, "orders");
  const visits = sumBy(rows, "visits");

  return {
    days: rows.length,
    revenue,
    orders,
    visits,
    ticket: orders ? revenue / orders : 0,
    conversion: visits ? (orders / visits) * 100 : 0,
    goalReached: rows.filter((row) => row.revenue >= row.goal).length,
  };
}

export function percentChange(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export function previousWindow(rows = [], days, endDate) {
  const end = resolveEndDate(rows, endDate);
  if (!end) return [];

  const previousEnd = toIsoDate(new Date(parseIsoDate(end).getTime() - days * DAY_MS));
  return filterByPeriod(rows, days, previousEnd);
}

/**
 * Distribui a receita do período entre os canais e normaliza os percentuais
 * para somarem exatamente 100.
 */
export function aggregateChannels(rows = []) {
  const total = sumBy(rows, "revenue");

  const channels = channelMeta.map((channel) => ({
    key: channel.key,
    name: channel.name,
    color: channel.color,
    revenue: rows.reduce((sum, row) => sum + (row.channels?.[channel.key] ?? 0), 0),
  }));

  if (!total) {
    return channels.map((channel) => ({ ...channel, value: 0 }));
  }

  const percents = channels.map((channel) =>
    Math.round((channel.revenue / total) * 100)
  );
  const difference = 100 - percents.reduce((sum, value) => sum + value, 0);
  if (percents.length > 0) percents[0] += difference;

  return channels.map((channel, index) => ({ ...channel, value: percents[index] }));
}

/**
 * Série do gráfico: um ponto por dia em janelas curtas e um ponto por semana
 * nos 90 dias, para manter o gráfico legível.
 */
export function buildRevenueSeries(rows = [], days = 30) {
  if (rows.length === 0) return [];

  if (days <= 30) {
    return rows.map((row) => ({
      label: formatShortDate(row.date),
      revenue: row.revenue,
      goal: row.goal,
    }));
  }

  const buckets = [];

  for (let end = rows.length; end > 0; end -= 7) {
    const chunk = rows.slice(Math.max(0, end - 7), end);

    buckets.unshift({
      label: formatShortDate(chunk[0].date),
      revenue: sumBy(chunk, "revenue"),
      goal: sumBy(chunk, "goal"),
    });
  }

  return buckets;
}

export function buildDashboardView({ daily = [], orders = [], days = 30, endDate } = {}) {
  const rows = filterByPeriod(daily, days, endDate);
  const previousRows = previousWindow(daily, days, endDate);
  const current = summarize(rows);
  const previous = summarize(previousRows);

  return {
    days,
    endDate: resolveEndDate(daily, endDate),
    isEmpty: rows.length === 0,
    series: buildRevenueSeries(rows, days),
    channels: aggregateChannels(rows),
    orders: filterByPeriod(orders, days, endDate).sort(
      (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
    ),
    kpis: {
      ...current,
      revenueDelta: percentChange(current.revenue, previous.revenue),
      ordersDelta: percentChange(current.orders, previous.orders),
      conversionDelta: current.conversion - previous.conversion,
    },
    lastUpdated: DATA_UPDATED_LABEL,
  };
}
