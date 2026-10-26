export const CSV_SEPARATOR = ";";

export const CSV_HEADER = ["Pedido", "Cliente", "Produto", "Valor", "Status", "Data"];

export function escapeCsvField(value) {
  const text = value === null || value === undefined ? "" : String(value);

  if (/["\r\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function formatCsvNumber(value) {
  return Number(value || 0)
    .toFixed(2)
    .replace(".", ",");
}

export function formatCsvDate(isoDate) {
  if (!isoDate) return "";

  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;

  return `${day}/${month}/${year}`;
}

/**
 * CSV pronto para o Excel pt-BR: BOM UTF-8, separador ";" e quebras CRLF.
 */
export function buildOrdersCsv(orders = []) {
  const rows = [
    CSV_HEADER,
    ...orders.map((order) => [
      order.id,
      order.customer,
      order.product,
      formatCsvNumber(order.value),
      order.status,
      formatCsvDate(order.date),
    ]),
  ];

  const body = rows
    .map((row) => row.map(escapeCsvField).join(CSV_SEPARATOR))
    .join("\r\n");

  return `\uFEFF${body}\r\n`;
}

export function csvFileName(days, endDate) {
  const suffix = endDate ? `-${endDate}` : "";
  return `pedidos-${days}-dias${suffix}.csv`;
}
