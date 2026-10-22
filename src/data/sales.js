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

export const channels = [
  { name: "Loja online", value: 46, color: "#5eead4" },
  { name: "Marketplace", value: 27, color: "#a78bfa" },
  { name: "Instagram", value: 17, color: "#60a5fa" },
  { name: "Indicação", value: 10, color: "#fbbf24" },
];

export const recentOrders = [
  {
    id: "#1042",
    customer: "Mariana Alves",
    product: "Fone Bluetooth",
    value: 349.9,
    status: "Pago",
    date: "22/10",
  },
  {
    id: "#1041",
    customer: "Rafael Souza",
    product: "Teclado mecânico",
    value: 489.0,
    status: "Enviado",
    date: "22/10",
  },
  {
    id: "#1040",
    customer: "Camila Ribeiro",
    product: "Mouse sem fio",
    value: 189.9,
    status: "Pago",
    date: "21/10",
  },
  {
    id: "#1039",
    customer: "Bruno Carvalho",
    product: "Suporte para notebook",
    value: 129.9,
    status: "Aguardando",
    date: "21/10",
  },
  {
    id: "#1038",
    customer: "Letícia Martins",
    product: "Webcam Full HD",
    value: 279.0,
    status: "Enviado",
    date: "20/10",
  },
  {
    id: "#1037",
    customer: "Diego Fernandes",
    product: "Hub USB-C",
    value: 219.9,
    status: "Cancelado",
    date: "20/10",
  },
];

export const statusStyles = {
  Pago: "success",
  Enviado: "info",
  Aguardando: "warning",
  Cancelado: "danger",
};

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
