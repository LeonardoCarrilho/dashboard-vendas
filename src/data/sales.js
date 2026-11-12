// Dados simulados de uma operação de e-commerce.
// Para usar dados reais, troque este arquivo por uma chamada à sua API.

export const monthly = [
  { month: "Jan", revenue: 42800, orders: 312, goal: 40000 },
  { month: "Fev", revenue: 39100, orders: 287, goal: 42000 },
  { month: "Mar", revenue: 47600, orders: 341, goal: 44000 },
  { month: "Abr", revenue: 52300, orders: 376, goal: 46000 },
  { month: "Mai", revenue: 49800, orders: 358, goal: 48000 },
  { month: "Jun", revenue: 61200, orders: 421, goal: 50000 },
  { month: "Jul", revenue: 58400, orders: 402, goal: 52000 },
  { month: "Ago", revenue: 65700, orders: 448, goal: 54000 },
  { month: "Set", revenue: 70200, orders: 476, goal: 56000 },
  { month: "Out", revenue: 68900, orders: 461, goal: 58000 },
  { month: "Nov", revenue: 84500, orders: 558, goal: 62000 },
  { month: "Dez", revenue: 92100, orders: 604, goal: 68000 },
];

export const channelMeta = [
  { key: "loja", name: "Loja online", share: 0.46, color: "#b44825" },
  { key: "marketplace", name: "Marketplace", share: 0.27, color: "#5b705b" },
  { key: "instagram", name: "Instagram", share: 0.17, color: "#71818b" },
  { key: "indicacao", name: "Indicação", share: 0.1, color: "#b79d62" },
];

// Último dia com dados e horário da consolidação.
export const DATA_END_DATE = "2026-10-22";
export const DATA_UPDATED_LABEL = "22/10/2026 às 18:40";
export const DATA_UPDATED_ISO = "2026-10-22T18:40:00-03:00";

export const statusStyles = {
  Pago: "success",
  Enviado: "info",
  Aguardando: "warning",
  Cancelado: "danger",
};

const DAY_MS = 24 * 60 * 60 * 1000;
// 180 dias para permitir comparar os 90 dias atuais com a janela anterior.
const WINDOW_DAYS = 180;
const YEAR = 2026;

const seeded = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const round2 = (value) => Math.round(value * 100) / 100;

function buildDaily() {
  const end = new Date(`${DATA_END_DATE}T00:00:00Z`);
  const start = new Date(end.getTime() - (WINDOW_DAYS - 1) * DAY_MS);
  const rows = [];

  monthly.forEach((month, monthIndex) => {
    const daysInMonth = new Date(Date.UTC(YEAR, monthIndex + 1, 0)).getUTCDate();
    const weights = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const weekday = new Date(Date.UTC(YEAR, monthIndex, day)).getUTCDay();
      const weekend = weekday === 0 || weekday === 6 ? 0.86 : 1.05;
      const wave = 1 + 0.16 * Math.sin((day + monthIndex * 2) / 2.2);
      const jitter = 0.9 + 0.2 * seeded(monthIndex * 131 + day);
      return weekend * wave * jitter;
    });
    const totalWeight = weights.reduce((total, weight) => total + weight, 0);

    for (let index = 0; index < daysInMonth; index += 1) {
      const date = new Date(Date.UTC(YEAR, monthIndex, index + 1));

      if (date < start || date > end) continue;

      const weight = weights[index] / totalWeight;
      const revenue = Math.round(month.revenue * weight);
      const orders = Math.max(1, Math.round(month.orders * weight));
      const conversion = 0.031 + 0.012 * seeded(monthIndex * 71 + index * 3);
      const visits = Math.max(orders, Math.round(orders / conversion));

      const channelWeights = channelMeta.map(
        (channel) =>
          channel.share * (0.92 + 0.16 * seeded(monthIndex * 97 + index * 5 + channel.key.length))
      );
      const channelWeightSum = channelWeights.reduce((total, value) => total + value, 0);
      const channels = {};
      let allocated = 0;

      channelMeta.forEach((channel, channelIndex) => {
        if (channelIndex === channelMeta.length - 1) {
          channels[channel.key] = Math.max(0, revenue - allocated);
          return;
        }

        const value = Math.round((revenue * channelWeights[channelIndex]) / channelWeightSum);
        channels[channel.key] = value;
        allocated += value;
      });

      rows.push({
        date: date.toISOString().slice(0, 10),
        revenue,
        orders,
        visits,
        goal: Math.round(month.goal / daysInMonth),
        channels,
      });
    }
  });

  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

const orderCustomers = [
  "Mariana Alves",
  "Rafael Souza",
  "Camila Ribeiro",
  "Bruno Carvalho",
  "Letícia Martins",
  "Diego Fernandes",
  "Paula Nogueira",
  "Thiago Barros",
  "Aline Prado",
  "Gustavo Lima",
  "Renata Dias",
  "Felipe Moraes",
];

const orderProducts = [
  { name: "Fone Bluetooth", price: 349.9 },
  { name: "Teclado mecânico", price: 489 },
  { name: "Mouse sem fio", price: 189.9 },
  { name: "Suporte para notebook", price: 129.9 },
  { name: "Webcam Full HD", price: 279 },
  { name: "Hub USB-C", price: 219.9 },
  { name: "Smartwatch Pulse", price: 499 },
  { name: "Mochila urbana", price: 259.9 },
];

const orderStatuses = ["Pago", "Enviado", "Aguardando", "Cancelado"];

const fixedOrders = [
  { customer: "Mariana Alves", product: "Fone Bluetooth", value: 349.9, status: "Pago", date: "2026-10-22" },
  { customer: "Rafael Souza", product: "Teclado mecânico", value: 489, status: "Enviado", date: "2026-10-22" },
  { customer: "Camila Ribeiro", product: "Mouse sem fio", value: 189.9, status: "Pago", date: "2026-10-21" },
  { customer: "Bruno Carvalho", product: "Suporte para notebook", value: 129.9, status: "Aguardando", date: "2026-10-21" },
  { customer: "Letícia Martins", product: "Webcam Full HD", value: 279, status: "Enviado", date: "2026-10-20" },
  { customer: "Diego Fernandes", product: "Hub USB-C", value: 219.9, status: "Cancelado", date: "2026-10-20" },
];

function buildOrders(days) {
  const raw = days.slice(0, -3).flatMap((day, index) => {
    if (seeded(index * 7 + 3) < 0.5) return [];

    const customer = orderCustomers[Math.floor(seeded(index * 13 + 1) * orderCustomers.length)];
    const product = orderProducts[Math.floor(seeded(index * 17 + 5) * orderProducts.length)];
    const quantity = seeded(index * 19 + 2) > 0.82 ? 2 : 1;
    const status = orderStatuses[Math.floor(seeded(index * 23 + 9) * orderStatuses.length)];

    return [
      {
        customer,
        product: product.name,
        value: round2(product.price * quantity),
        status,
        date: day.date,
      },
    ];
  });

  const sorted = [...raw, ...fixedOrders].sort(
    (a, b) => a.date.localeCompare(b.date) || a.customer.localeCompare(b.customer, "pt-BR")
  );

  return sorted
    .map((order, index) => ({ ...order, id: `#${1000 + index}` }))
    .reverse();
}

export const daily = buildDaily();
export const orders = buildOrders(daily);
export const recentOrders = orders;

export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCurrencyPrecise = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
