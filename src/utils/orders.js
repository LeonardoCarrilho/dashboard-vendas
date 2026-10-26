export const ORDER_SORT_LABELS = {
  customer: "cliente",
  value: "valor",
  date: "data",
};

const idNumber = (id) => Number(String(id).replace(/\D/g, "")) || 0;

export function sortOrders(orders = [], { key = "date", direction = "desc" } = {}) {
  const factor = direction === "asc" ? 1 : -1;

  return [...orders].sort((a, b) => {
    if (key === "value") {
      return ((Number(a.value) || 0) - (Number(b.value) || 0)) * factor;
    }

    if (key === "customer") {
      return (
        a.customer.localeCompare(b.customer, "pt-BR", { sensitivity: "base" }) * factor
      );
    }

    return a.date.localeCompare(b.date) * factor || (idNumber(a.id) - idNumber(b.id)) * factor;
  });
}

export function nextSort(current, key) {
  if (current.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }

  return { key, direction: key === "customer" ? "asc" : "desc" };
}

export function ariaSortFor(sort, key) {
  if (sort.key !== key) return "none";
  return sort.direction === "asc" ? "ascending" : "descending";
}
